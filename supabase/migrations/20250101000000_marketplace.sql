-- Migration: Create marketplace table
-- This table will store published courses that can appear in the marketplace

CREATE TABLE IF NOT EXISTS "public"."marketplace_course" (
    "id" uuid DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "course_id" uuid NOT NULL,
    "organization_id" uuid NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "featured" boolean DEFAULT false NOT NULL,
    "category" character varying DEFAULT 'general'::character varying,
    "tags" text[] DEFAULT '{}'::text[],
    "rating" numeric DEFAULT '0.0'::numeric,
    "review_count" integer DEFAULT 0,
    "enrollment_count" integer DEFAULT 0,
    "price_override" bigint,
    "currency_override" character varying,
    "display_order" integer DEFAULT 0
);

ALTER TABLE "public"."marketplace_course" OWNER TO "postgres";

-- Add primary key constraint
ALTER TABLE ONLY "public"."marketplace_course"
    ADD CONSTRAINT "marketplace_course_pkey" PRIMARY KEY ("id");

-- Add unique constraint for course_id (each course can only appear once in marketplace)
ALTER TABLE ONLY "public"."marketplace_course"
    ADD CONSTRAINT "marketplace_course_course_id_key" UNIQUE ("course_id");

-- Add foreign key constraints
ALTER TABLE ONLY "public"."marketplace_course"
    ADD CONSTRAINT "marketplace_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."marketplace_course"
    ADD CONSTRAINT "marketplace_course_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE CASCADE;

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER "handle_marketplace_course_updated_at" BEFORE UPDATE ON "public"."marketplace_course" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

-- Create index for better performance
CREATE INDEX "idx_marketplace_course_is_active" ON "public"."marketplace_course" USING btree ("is_active");
CREATE INDEX "idx_marketplace_course_featured" ON "public"."marketplace_course" USING btree ("featured");
CREATE INDEX "idx_marketplace_course_category" ON "public"."marketplace_course" USING btree ("category");
CREATE INDEX "idx_marketplace_course_rating" ON "public"."marketplace_course" USING btree ("rating" DESC);
CREATE INDEX "idx_marketplace_course_created_at" ON "public"."marketplace_course" USING btree ("created_at" DESC);

-- Function to automatically add published courses to marketplace
CREATE OR REPLACE FUNCTION "public"."add_course_to_marketplace"()
RETURNS "trigger" AS $$
BEGIN
    -- Only add to marketplace if course is published and not deleted
    IF NEW.is_published = true AND NEW.status = 'ACTIVE' THEN
        INSERT INTO "public"."marketplace_course" (
            "course_id", 
            "organization_id",
            "category",
            "tags"
        ) VALUES (
            NEW.id,
            (SELECT o.id FROM "public"."organization" o 
             JOIN "public"."group" g ON g.organization_id = o.id 
             WHERE g.id = NEW.group_id),
            COALESCE(NEW.metadata->>'category', 'general'),
            COALESCE(NEW.metadata->>'tags', '{}')
        )
        ON CONFLICT ("course_id") DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically add courses to marketplace when published
CREATE TRIGGER "trigger_add_course_to_marketplace"
    AFTER UPDATE OF "is_published" ON "public"."course"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."add_course_to_marketplace"();

-- Function to remove course from marketplace when unpublished or deleted
CREATE OR REPLACE FUNCTION "public"."remove_course_from_marketplace"()
RETURNS "trigger" AS $$
BEGIN
    -- Remove from marketplace if course is unpublished or deleted
    IF NEW.is_published = false OR NEW.status != 'ACTIVE' THEN
        DELETE FROM "public"."marketplace_course" WHERE "course_id" = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically remove courses from marketplace when unpublished
CREATE TRIGGER "trigger_remove_course_from_marketplace"
    AFTER UPDATE OF "is_published", "status" ON "public"."course"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."remove_course_from_marketplace"();

-- Function to get marketplace courses
CREATE OR REPLACE FUNCTION "public"."get_marketplace_courses"(
    "limit_arg" integer DEFAULT 20,
    "offset_arg" integer DEFAULT 0,
    "category_arg" character varying DEFAULT NULL,
    "featured_arg" boolean DEFAULT NULL
)
RETURNS TABLE(
    "id" uuid,
    "course_id" uuid,
    "organization_id" uuid,
    "title" character varying,
    "description" character varying,
    "logo" text,
    "banner_image" text,
    "cost" bigint,
    "currency" character varying,
    "slug" character varying,
    "is_active" boolean,
    "featured" boolean,
    "category" character varying,
    "tags" text[],
    "rating" numeric,
    "review_count" integer,
    "enrollment_count" integer,
    "organization_name" character varying,
    "created_at" timestamp with time zone
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mc.id,
        mc.course_id,
        mc.organization_id,
        c.title,
        c.description,
        c.logo,
        c.banner_image,
        COALESCE(mc.price_override, c.cost) as cost,
        COALESCE(mc.currency_override, c.currency) as currency,
        c.slug,
        mc.is_active,
        mc.featured,
        mc.category,
        mc.tags,
        mc.rating,
        mc.review_count,
        mc.enrollment_count,
        o.name as organization_name,
        c.created_at
    FROM "public"."marketplace_course" mc
    JOIN "public"."course" c ON c.id = mc.course_id
    JOIN "public"."organization" o ON o.id = mc.organization_id
    WHERE mc.is_active = true
    AND c.is_published = true
    AND c.status = 'ACTIVE'
    AND (category_arg IS NULL OR mc.category = category_arg)
    AND (featured_arg IS NULL OR mc.featured = featured_arg)
    ORDER BY 
        CASE WHEN mc.featured = true THEN 1 ELSE 2 END,
        mc.rating DESC,
        mc.enrollment_count DESC,
        mc.created_at DESC
    LIMIT limit_arg OFFSET offset_arg;
END;
$$;
