import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Studio 42 — VIBE Prototyping',
  tagline: 'Accelerating presales with AI prototyping to unlock business potential at speed.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://wonderful-flower-0a2a87e03.7.azurestaticapps.net',
  baseUrl: '/',

  organizationName: 'ablack34',
  projectName: 'vibe-prototyping-framework',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          { from: '/why-vibe/scaling-vibe', to: '/why-vibe/leadership' },
          { from: '/why-vibe/impact', to: '/why-vibe/leadership' },
        ],
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Studio 42',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'vibeSidebar',
          position: 'left',
          label: 'VIBE Framework',
        },
        {
          href: 'https://github.com/ablack34/vibe-prototyping-framework',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Framework',
          items: [
            { label: 'Getting Started', to: '/getting-started/setup' },
            { label: 'Playbook', to: '/phases/discover' },
            { label: 'Prompt Reference', to: '/reference/prompts' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'GitHub Repository', href: 'https://github.com/ablack34/vibe-prototyping-framework' },
            { label: 'HVE-Core Extension', href: 'https://marketplace.visualstudio.com/items?itemName=ise-hve-essentials.hve-core-all' },
          ],
        },
      ],
      copyright: `Studio 42 — Microsoft Internal · ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['powershell', 'csharp', 'bicep'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
