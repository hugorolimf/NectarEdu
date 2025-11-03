import { fetchMarketplaceCourses, fetchMarketplaceCategories } from '$lib/utils/services/marketplace';
import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
  try {
    // You can add server-side loading logic here if needed
    // For now, we'll let the client handle the data fetching
    
    return {
      // Server-side data can be loaded here
      serverData: {
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error loading marketplace page:', error);
    
    // You can redirect to an error page or return error state
    return {
      serverData: {
        timestamp: new Date().toISOString(),
        error: 'Failed to load marketplace'
      }
    };
  }
}
