<script>
  import PageSignupCTA from '$lib/PageSignupCTA/index.svelte';
</script>

<svelte:head>
  <title>Free Tools | NectarEDU</title>
  <meta
    property="og:image"
    itemprop="image"
    content="https://brand.cdn.clsrio.com/og/free-tools.png"
  />
  <meta property="og:title" content="NectarEDU Free Tools" />
  <meta
    property="og:description"
    content="At NectarEDU, we have built a suit of tools for anyone to use freely while collaborating with students"
  />

  <meta
    property="og:image:secure_url"
    itemprop="image"
    content="https://brand.cdn.clsrio.com/og/free-tools.png"
  />

  <meta name="twitter:title" content="NectarEDU Free Tools" />
  <meta
    name="twitter:description"
    content="At NectarEDU, we have built a suit of tools for anyone to use freely while collaborating with students"
  />
  <meta name="twitter:image" content="https://brand.cdn.clsrio.com/og/free-tools.png" />
</svelte:head>

<slot />

<PageSignupCTA
  header="Scale Your Bootcamp Today with NectarEDU"
  subText="NectarEDU gives small and medium bootcamps the power of online learning, simplified."
  btnLabel="Sign me up"
  link="/signup"
  demo={false}
/>
