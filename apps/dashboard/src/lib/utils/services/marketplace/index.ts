import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabase } from '$lib/utils/functions/supabase';

export interface MarketplaceCourse {
	id: string;
	course_id: string;
	organization_id: string;
	title: string;
	description: string;
	logo: string;
	banner_image: string;
	cost: number;
	currency: string;
	slug: string;
	is_active: boolean;
	featured: boolean;
	category: string;
	tags: string[];
	rating: number;
	review_count: number;
	enrollment_count: number;
	organization_name: string;
	created_at: string;
}

export interface MarketplaceFilters {
	category?: string;
	featured?: boolean;
	limit?: number;
	offset?: number;
}

export async function fetchMarketplaceCourses(filters: MarketplaceFilters = {}) {
	const { category, featured, limit = 20, offset = 0 } = filters;

	try {
		// Usar a nova função do banco de dados
		const { data: courses, error } = await supabase.rpc('get_marketplace_courses', {
			limit_arg: limit,
			offset_arg: offset,
			category_arg: category,
			featured_arg: featured
		});

		if (error) {
			console.error('Error fetching marketplace courses:', error);
			return { data: [], error };
		}

		return { data: courses || [], error: null };
	} catch (err) {
		console.error('Unexpected error:', err);
		return { data: [], error: err as PostgrestError };
	}
}

export async function fetchMarketplaceCategories() {
	// Temporariamente retornando categorias fixas
	// Futuramente isso pode vir de uma tabela no banco
	const categories = [
		{ id: 'all', name: 'All Categories', count: 0 },
		{ id: 'general', name: 'General', count: 0 },
		{ id: 'technology', name: 'Technology', count: 0 },
		{ id: 'business', name: 'Business', count: 0 },
		{ id: 'design', name: 'Design', count: 0 },
		{ id: 'marketing', name: 'Marketing', count: 0 },
		{ id: 'development', name: 'Development', count: 0 }
	];

	return { data: categories, error: null };
}

export async function toggleCourseMarketplaceStatus(courseId: string, isActive: boolean) {
	try {
		// Esta função será usada quando tivermos a tabela marketplace_course
		// Por enquanto, vamos apenas atualizar o status do curso
		const { data, error } = await supabase
			.from('course')
			.update({ is_published: isActive })
			.eq('id', courseId)
			.select()
			.single();

		if (error) {
			console.error('Error toggling marketplace status:', error);
			return { data: null, error };
		}

		return { data, error: null };
	} catch (err) {
		console.error('Unexpected error:', err);
		return { data: null, error: err as PostgrestError };
	}
}

export async function updateMarketplaceCourse(courseId: string, updates: Partial<MarketplaceCourse>) {
	try {
		// Futuramente irá atualizar a tabela marketplace_course
		// Por enquanto, atualiza apenas o course
		const { data, error } = await supabase
			.from('course')
			.update({
				title: updates.title,
				description: updates.description,
				cost: updates.cost,
				currency: updates.currency
			})
			.eq('id', courseId)
			.select()
			.single();

		if (error) {
			console.error('Error updating marketplace course:', error);
			return { data: null, error };
		}

		return { data, error: null };
	} catch (err) {
		console.error('Unexpected error:', err);
		return { data: null, error: err as PostgrestError };
	}
}
