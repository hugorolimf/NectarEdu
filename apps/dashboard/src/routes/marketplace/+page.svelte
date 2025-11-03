<script lang="ts">
  import MarketplaceGrid from '$lib/components/Marketplace/MarketplaceGrid.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { profile } from '$lib/utils/store/user';
  import { currentOrg } from '$lib/utils/store/org';

  function handleEnroll(event: CustomEvent<{ courseId: string; slug?: string }>) {
    // Handle course enrollment
    const { courseId, slug } = event.detail;

    console.log('🎯 Enroll clicked:', { courseId, slug, profile: $profile });

    // Use slug if available, otherwise use courseId
    const courseIdentifier = slug || courseId;

    if (!courseIdentifier) {
      console.error('❌ No course identifier available!');
      return;
    }

    console.log('📍 Course identifier:', courseIdentifier);

    // Check if user is logged in
    if (!$profile?.id) {
      console.log('❌ User not logged in, redirecting to login...');
      const loginUrl = `/login?redirect=/course/${encodeURIComponent(courseIdentifier)}`;
      console.log('🔗 Redirecting to:', loginUrl);
      // Redirect to login with course redirect
      goto(loginUrl);
    } else {
      console.log('✅ User logged in, navigating to course...');
      const courseUrl = `/course/${courseIdentifier}`;
      console.log('🔗 Navigating to:', courseUrl);
      // User is logged in, navigate to course page
      goto(courseUrl);
    }
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
