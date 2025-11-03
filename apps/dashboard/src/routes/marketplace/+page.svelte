<script lang="ts">
  import MarketplaceGrid from '$lib/components/Marketplace/MarketplaceGrid.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { profile } from '$lib/utils/store/user';
  import { currentOrg } from '$lib/utils/store/org';

  function handleEnroll(event: CustomEvent<{ courseId: string }>) {
    // Handle course enrollment
    const { courseId } = event.detail;

    // For now, just navigate to the course page
    // In the future, this could open an enrollment modal
    goto(`/course/${courseId}`);
  }

  onMount(() => {
    // Track marketplace visit
    console.log('Marketplace visited by:', $profile?.email);
  });
</script>

<svelte:head>
  <title>Marketplace - NectarEDU</title>
  <meta name="description" content="Discover and enroll in courses from top instructors" />
</svelte:head>

<section class="w-full">
  <div class="px-2 py-2 md:px-5 md:py-10">
    <MarketplaceGrid on:enroll={handleEnroll} />
  </div>
</section>
