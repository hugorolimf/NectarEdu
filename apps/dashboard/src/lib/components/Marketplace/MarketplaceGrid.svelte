<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, Dropdown, ButtonSet } from 'carbon-components-svelte';
  import MarketplaceCard from './MarketplaceCard.svelte';
  import { fetchMarketplaceCourses, fetchMarketplaceCategories, type MarketplaceCourse, type MarketplaceFilters } from '$lib/utils/services/marketplace';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { VARIANTS } from '$lib/components/PrimaryButton/constants';
  import { t } from '$lib/utils/functions/translations';
  import { get } from 'svelte/store';
  import Grid from 'carbon-icons-svelte/lib/Grid.svelte';
  import List from 'carbon-icons-svelte/lib/List.svelte';
  import { browser } from '$app/environment';
  import { createEventDispatcher } from 'svelte';

  export let emptyTitle = 'No courses found';
  export let emptyDescription = 'Try adjusting your filters or check back later for new courses.';

  let dispatch = createEventDispatcher();

  let courses: MarketplaceCourse[] = [];
  let categories: { id: string; name: string; count: number }[] = [];
  let isLoading = true;
  let searchValue = '';
  let selectedCategory = 'all';
  let featuredOnly = false;
  let viewMode: 'grid' | 'list' = 'grid';
  let currentPage = 1;
  let hasMore = true;
  let totalCount = 0;

  const COURSES_PER_PAGE = 12;

  async function loadCourses(append = false) {
    if (isLoading && !append) return;

    isLoading = true;

    const filters: MarketplaceFilters = {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      featured: featuredOnly || undefined,
      limit: COURSES_PER_PAGE,
      offset: append ? courses.length : 0
    };

    try {
      const { data: newCourses, error } = await fetchMarketplaceCourses(filters);

      if (error) {
        console.error('Error loading courses:', error);
        return;
      }

      if (append) {
        courses = [...courses, ...newCourses];
      } else {
        courses = newCourses;
      }

      hasMore = newCourses.length === COURSES_PER_PAGE;
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      isLoading = false;
    }
  }

  async function loadCategories() {
    try {
      const { data: categoriesData, error } = await fetchMarketplaceCategories();

      if (error) {
        console.error('Error loading categories:', error);
        return;
      }

      categories = categoriesData || [];
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  function handleSearch() {
    currentPage = 1;
    loadCourses();
  }

  function handleCategoryChange() {
    currentPage = 1;
    loadCourses();
  }

  function handleFeaturedToggle() {
    featuredOnly = !featuredOnly;
    currentPage = 1;
    loadCourses();
  }

  function handleViewChange(mode: 'grid' | 'list') {
    viewMode = mode;
    if (browser) {
      localStorage.setItem('marketplaceView', mode);
    }
  }

  function handleEnroll(event: CustomEvent<{ courseId: string }>) {
    dispatch('enroll', event.detail);
  }

  function loadMore() {
    if (!isLoading && hasMore) {
      currentPage++;
      loadCourses(true);
    }
  }

  onMount(async () => {
    // Load saved view preference
    if (browser) {
      const savedView = localStorage.getItem('marketplaceView') as 'grid' | 'list' | null;
      if (savedView) {
        viewMode = savedView;
      }
    }

    await Promise.all([
      loadCategories(),
      loadCourses()
    ]);
  });

  // Reactive search with debouncing
  let searchTimeout: NodeJS.Timeout;
  $: if (searchValue !== undefined) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      handleSearch();
    }, 300);
  }

  // Helper function for translations
  function translate(key: string, fallback: string) {
    return get(t)(key) || fallback;
  }
</script>

<div class="marketplace-container">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold dark:text-white mb-2">
      {translate('marketplace.heading', 'Course Marketplace')}
    </h1>
    <p class="text-gray-600 dark:text-gray-400">
      {translate('marketplace.description', 'Discover and enroll in courses from top instructors')}
    </p>
  </div>

  <!-- Filters -->
  <div class="mb-6 space-y-4">
    <!-- Search and Category -->
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <Search
          placeholder={translate('marketplace.search_placeholder', 'Search for courses...')}
          bind:value={searchValue}
          class="w-full"
        />
      </div>
      
      <div class="flex gap-2">
        <Dropdown
          bind:selectedId={selectedCategory}
          items={categories.map(cat => ({ id: cat.id, text: cat.name }))}
          on:select={handleCategoryChange}
        />
        
        <PrimaryButton
          label={featuredOnly ? 'Featured Only' : 'All Courses'}
          variant={featuredOnly ? VARIANTS.CONTAINED : VARIANTS.OUTLINED}
          onClick={handleFeaturedToggle}
        />
      </div>
    </div>

    <!-- View Controls -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        {#if isLoading}
          Loading courses...
        {:else}
          Showing {courses.length} courses
        {/if}
      </div>

      <ButtonSet>
        <button
          class="cds--btn cds--btn--secondary cds--btn--sm {viewMode === 'grid' ? 'cds--btn--selected' : ''}"
          on:click={() => handleViewChange('grid')}
        >
          <Grid size={16} />
        </button>
        <button
          class="cds--btn cds--btn--secondary cds--btn--sm {viewMode === 'list' ? 'cds--btn--selected' : ''}"
          on:click={() => handleViewChange('list')}
        >
          <List size={16} />
        </button>
      </ButtonSet>
    </div>
  </div>

  <!-- Courses Grid/List -->
  {#if isLoading && courses.length === 0}
    <!-- Loading skeleton -->
    <div class="{viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'} gap-6">
      {#each Array(8) as _}
        <MarketplaceCard {isLoading} />
      {/each}
    </div>
  {:else if courses.length > 0}
    <div class="{viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'} gap-6">
      {#each courses as course}
        <MarketplaceCard 
          {course} 
          {isLoading} 
          on:enroll={handleEnroll}
        />
      {/each}
    </div>

    <!-- Load More Button -->
    {#if hasMore}
      <div class="mt-8 text-center">
        <PrimaryButton
          label={isLoading ? 'Loading...' : 'Load More'}
          isDisabled={isLoading}
          onClick={loadMore}
          variant={VARIANTS.OUTLINED}
        />
      </div>
    {/if}
  {:else}
    <!-- Empty State -->
    <div class="text-center py-12">
      <div class="mb-4">
        <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
          <Grid size={32} class="text-gray-400" />
        </div>
      </div>
      <h3 class="text-xl font-semibold dark:text-white mb-2">
        {emptyTitle}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {emptyDescription}
      </p>
    </div>
  {/if}
</div>

<style>
  .marketplace-container {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
