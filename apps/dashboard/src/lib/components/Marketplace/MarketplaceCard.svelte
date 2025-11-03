<script lang="ts">
  import { goto } from '$app/navigation';
  import { VARIANTS } from '$lib/components/PrimaryButton/constants';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import getCurrencyFormatter from '$lib/utils/functions/getCurrencyFormatter';
  import { t } from '$lib/utils/functions/translations';
  import {
    ImageLoader,
    SkeletonPlaceholder,
    Tag
  } from 'carbon-components-svelte';
  import StarFilled from 'carbon-icons-svelte/lib/StarFilled.svelte';
  import EnterpriseIcon from 'carbon-icons-svelte/lib/Enterprise.svelte';
  import { createEventDispatcher } from 'svelte';

  export let course: {
    id: string;
    course_id: string;
    title: string;
    description: string;
    logo: string;
    banner_image: string;
    cost: number;
    currency: string;
    slug: string;
    category: string;
    tags: string[];
    rating: number;
    review_count: number;
    enrollment_count: number;
    organization_name: string;
    featured: boolean;
    created_at: string;
  } | null = null;
  export let isLoading = false;

  const dispatch = createEventDispatcher();

  $: formatter = getCurrencyFormatter(course?.currency || 'USD');

  function handleCourseClick() {
    if (course) {
      goto(`/course/${course.slug}`);
    }
  }

  function handleEnrollClick(e: Event) {
    e.stopPropagation();
    if (course) {
      dispatch('enroll', { courseId: course.course_id });
    }
  }

  function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      technology: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      design: 'bg-purple-100 text-purple-800',
      marketing: 'bg-pink-100 text-pink-800',
      development: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || colors.general;
  }

  function getCategoryLabel(category: string) {
    const labels: Record<string, string> = {
      general: 'General',
      technology: 'Technology',
      business: 'Business',
      design: 'Design',
      marketing: 'Marketing',
      development: 'Development'
    };
    return labels[category] || 'General';
  }
</script>

{#if isLoading}
  <div class="border-gray group relative w-full max-w-[320px] rounded border text-black dark:border-neutral-600">
    <div class="p-4">
      <div class="relative mb-5">
        <SkeletonPlaceholder style="width: 100%; height: 200px;" />
      </div>
      <SkeletonPlaceholder style="width: 80%; height: 24px; margin-bottom: 8px;" />
      <SkeletonPlaceholder style="width: 100%; height: 16px; margin-bottom: 16px;" />
      <SkeletonPlaceholder style="width: 60%; height: 16px;" />
    </div>
  </div>
{:else if course}
  <div
    role="button"
    tabindex="0"
    on:click={handleCourseClick}
    on:keydown={(e) => {
      if (e.key === 'Enter') {
        handleCourseClick();
      }
    }}
    class="border-gray group relative w-full max-w-[320px] rounded border text-black dark:border-neutral-600 hover:shadow-lg transition-shadow duration-200"
  >
    <div class="p-4">
      <div class="relative mb-5">
        {#if course.featured}
          <div class="absolute top-2 left-2 z-10">
            <Tag type="purple" size="sm">Featured</Tag>
          </div>
        {/if}

        <ImageLoader
          src={course.banner_image || course.logo}
          alt="Course Banner"
          class="relative h-[200px] w-full rounded dark:border dark:border-neutral-600"
        >
          <svelte:fragment slot="loading">
            <SkeletonPlaceholder style="width: 100%; height: 200px;" />
          </svelte:fragment>
          <svelte:fragment slot="error">Course Image</svelte:fragment>
        </ImageLoader>

        <div class="absolute bottom-2 left-2 z-10">
          <span class="{getCategoryColor(course.category)} flex items-center gap-1 rounded-sm px-2 py-1 font-mono text-xs capitalize">
            {getCategoryLabel(course.category)}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 mb-2">
        <EnterpriseIcon size={16} class="text-gray-500" />
        <span class="text-xs text-gray-600 dark:text-gray-400">{course.organization_name}</span>
      </div>

      <h3 class="title text-xl font-semibold dark:text-white mb-2">{course.title}</h3>
      <p class="description text-sm text-gray-600 dark:text-gray-300 mb-4">
        {course.description}
      </p>

      <!-- Rating and Reviews -->
      <div class="flex items-center gap-3 mb-3">
        <div class="flex items-center gap-1">
          <StarFilled size={16} class="text-yellow-500" />
          <span class="text-sm font-medium dark:text-white">{course.rating.toFixed(1)}</span>
        </div>
        <span class="text-xs text-gray-500">({course.review_count} reviews)</span>
        <span class="text-xs text-gray-500">•</span>
        <span class="text-xs text-gray-500">{course.enrollment_count} students</span>
      </div>

      <!-- Tags -->
      {#if course.tags && course.tags.length > 0}
        <div class="flex flex-wrap gap-1 mb-3">
          {#each course.tags.slice(0, 3) as tag}
            <span class="bg-gray-100 text-gray-700 rounded px-2 py-1 text-xs">
              {tag}
            </span>
          {/each}
          {#if course.tags.length > 3}
            <span class="text-xs text-gray-500">+{course.tags.length - 3} more</span>
          {/if}
        </div>
      {/if}
    </div>

    <div class="border-gray flex justify-between items-center border-t px-4 py-3 dark:border-neutral-600">
      <div>
        <p class="text-lg font-bold dark:text-white">
          {#if course.cost === 0}
            <span class="text-green-600">Free</span>
          {:else}
            {formatter.format(course.cost)}
          {/if}
        </p>
      </div>

      <PrimaryButton
        label="Enroll Now"
        variant={VARIANTS.CONTAINED}
        on:click={handleEnrollClick}
        className="rounded-lg"
      />
    </div>
  </div>
{:else}
  <!-- Empty state -->
  <div class="border-gray group relative w-full max-w-[320px] rounded border text-black dark:border-neutral-600">
    <div class="p-4 text-center">
      <p class="text-gray-500 dark:text-gray-400">Course not available</p>
    </div>
  </div>
{/if}

<style>
  .title,
  .description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    -ms-box-orient: vertical;
    box-orient: vertical;
    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    -ms-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  .title {
    height: 28px;
    line-height: 14px;
  }

  .description {
    height: 40px;
    line-height: 20px;
  }
</style>
