import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  head: (
    <>
      <title>NectarEDU | The Open Source Learning Management System for Companies</title>
      <meta
        name="description"
        content="A flexible, user-friendly platform for creating, managing, and delivering courses for companies and training organisations"
      />

      <meta property="og:url" content="https://NectarEDU.com/docs" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="NectarEDU | The Open Source Learning Management System for Companies"
      />
      <meta
        property="og:description"
        content="A flexible, user-friendly platform for creating, managing, and delivering courses for companies and training organisations"
      />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1920" />
      <meta property="og:image:height" content="1080" />
      <meta
        property="og:image:secure_url"
        itemProp="image"
        content="https://brand.cdn.clsrio.com/og/NectarEDU-og.png"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="NectarEDU.com" />
      <meta property="twitter:url" content="https://NectarEDU.com/docs" />
      <meta
        name="twitter:title"
        content="NectarEDU | The Open Source Learning Management System for Companies"
      />
      <meta
        name="twitter:description"
        content="A flexible, user-friendly platform for creating, managing, and delivering courses for companies and training organisations"
      />
      <meta name="twitter:creator" content="@NectarEDU" />
      <meta name="twitter:image" content="https://brand.cdn.clsrio.com/og/NectarEDU-og.png" />
    </>
  ),
  logo: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={`${process.env.imagePath}/img/logo-512.png`}
        alt={'NectarEDU logo'}
        width={32}
        height={32}
      />
      <span style={{ marginLeft: '5px', lineHeight: '15px' }}>NectarEDU Docs</span>
    </div>
  ),
  navbar: {
    extraContent: (
      <a
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid gray',
          borderRadius: 5,
          padding: '2px 7px'
        }}
        href="https://app.NectarEDU.com"
      >
        Dashboard ↗
      </a>
    )
  },
  project: {
    link: 'https://github.com/rotimi-best/NectarEDU'
  },
  chat: {
    link: 'https://dub.sh/ciodiscord'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: false
  },
  docsRepositoryBase: 'https://github.com/rotimi-best/NectarEDU/tree/main/apps/docs',
  footer: {
    text: 'NectarEDU Docs'
  }
};

export default config;
