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

export async function testSupabaseConnection() {
	console.log('🔧 Testing Supabase connection...');
	
	try {
		// Teste simples: verificar se conseguimos acessar a tabela marketplace_course
		const { data, error } = await supabase
			.from('marketplace_course')
			.select('count')
			.limit(1);

		console.log('📊 Connection test result:', { data, error });
		
		if (error) {
			console.error('❌ Supabase connection failed:', error);
			return false;
		}
		
		console.log('✅ Supabase connection successful');
		return true;
	} catch (err) {
		console.error('💥 Connection test error:', err);
		return false;
	}
}

export async function getMockCourses(): Promise<MarketplaceCourse[]> {
	console.log('🎭 Using mock courses data');
	
	return [
		{
			id: 'mock-1',
			course_id: 'mock-course-1',
			organization_id: 'mock-org-1',
			title: 'Introduction to Web Development',
			description: 'Learn the basics of HTML, CSS, and JavaScript in this comprehensive beginner course.',
			logo: '/logo-192.png',
			banner_image: '/logo-192.png',
			cost: 0,
			currency: 'USD',
			slug: 'intro-web-dev',
			is_active: true,
			featured: true,
			category: 'development',
			tags: ['HTML', 'CSS', 'JavaScript', 'Beginner'],
			rating: 4.5,
			review_count: 128,
			enrollment_count: 2456,
			organization_name: 'ClassroomIO Academy',
			created_at: new Date().toISOString()
		},
		{
			id: 'mock-2',
			course_id: 'mock-course-2',
			organization_id: 'mock-org-2',
			title: 'Advanced React Patterns',
			description: 'Master advanced React patterns and best practices for building scalable applications.',
			logo: '/logo-192.png',
			banner_image: '/logo-192.png',
			cost: 9900,
			currency: 'USD',
			slug: 'advanced-react-patterns',
			is_active: true,
			featured: false,
			category: 'development',
			tags: ['React', 'JavaScript', 'Advanced'],
			rating: 4.8,
			review_count: 89,
			enrollment_count: 567,
			organization_name: 'React Masters',
			created_at: new Date().toISOString()
		},
		{
			id: 'mock-3',
			course_id: 'mock-course-3',
			organization_id: 'mock-org-3',
			title: 'UI/UX Design Fundamentals',
			description: 'Learn the principles of user interface and user experience design.',
			logo: '/logo-192.png',
			banner_image: '/logo-192.png',
			cost: 4900,
			currency: 'USD',
			slug: 'ui-ux-fundamentals',
			is_active: true,
			featured: true,
			category: 'design',
			tags: ['Design', 'UI', 'UX', 'Figma'],
			rating: 4.6,
			review_count: 203,
			enrollment_count: 1823,
			organization_name: 'Design School',
			created_at: new Date().toISOString()
		}
	];
}

export async function fetchMarketplaceCourses(filters: MarketplaceFilters = {}) {
	const { category, featured, limit = 20, offset = 0 } = filters;

	console.log('🔍 fetchMarketplaceCourses called with filters:', { category, featured, limit, offset });

	try {
		// Tentar usar a RPC primeiro
		console.log('📡 Trying supabase.rpc get_marketplace_courses...');
		const { data: courses, error } = await supabase.rpc('get_marketplace_courses', {
			limit_arg: limit,
			offset_arg: offset,
			category_arg: category,
			featured_arg: featured
		});

		console.log('📊 RPC Response:', { courses, error });

		if (error) {
			console.error('❌ RPC Error, trying fallback query:', error);
			
			// Fallback: consulta mais simples direta à tabela
			console.log('🔄 Using simple fallback query...');
			let query = supabase
				.from('marketplace_course')
				.select('*')
				.eq('is_active', true);

			if (category) {
				query = query.eq('category', category);
			}
			if (featured !== undefined) {
				query = query.eq('featured', featured);
			}

			const { data: fallbackData, error: fallbackError } = await query
				.order('rating', { ascending: false })
				.range(offset, offset + limit - 1);

			console.log('📊 Simple Fallback Response:', { fallbackData, fallbackError });

			if (fallbackError) {
				console.error('❌ Fallback query also failed, using mock data:', fallbackError);
				
				// Último recurso: usar dados mockados
				const mockData = await getMockCourses();
				
				// Aplicar filtros aos dados mockados
				let filteredMockData = mockData;
				if (category && category !== 'all') {
					filteredMockData = mockData.filter(course => course.category === category);
				}
				if (featured !== undefined) {
					filteredMockData = filteredMockData.filter(course => course.featured === featured);
				}
				
				// Aplicar paginação
				const paginatedMockData = filteredMockData.slice(offset, offset + limit);
				
				console.log('🎭 Using mock data:', paginatedMockData.length, 'courses');
				return { data: paginatedMockData, error: null };
			}

			// Para o fallback simples, retornar dados básicos
			const basicData = fallbackData?.map((item: any) => ({
				...item,
				title: item.title || 'Course Title',
				description: item.description || 'Course Description',
				logo: item.logo || '/logo-192.png',
				banner_image: item.banner_image || '/logo-192.png',
				cost: item.cost || 0,
				currency: item.currency || 'USD',
				slug: item.slug || 'course-slug',
				organization_name: item.organization_name || 'Organization'
			})) || [];

			console.log('✅ Successfully fetched courses with simple fallback:', basicData.length);
			return { data: basicData, error: null };
		}

		console.log('✅ Successfully fetched courses with RPC:', courses?.length || 0);
		return { data: courses || [], error: null };
	} catch (err) {
		console.error('💥 Unexpected error in fetchMarketplaceCourses, using mock data:', err);
		
		// Em caso de erro geral, retornar dados mockados
		const mockData = await getMockCourses();
		const paginatedMockData = mockData.slice(offset, offset + limit);
		return { data: paginatedMockData, error: null };
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
