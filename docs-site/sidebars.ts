import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  vibeSidebar: [
    {
      type: 'category',
      label: 'Why VIBE',
      collapsed: false,
      items: [
        'why-vibe/overview',
        'why-vibe/process',
        'why-vibe/case-studies',
        'why-vibe/scaling-vibe',
        'why-vibe/impact',
        'why-vibe/leadership',
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/setup',
        'getting-started/first-engagement',
        'getting-started/walkthrough',
        'getting-started/roles',
      ],
    },
    {
      type: 'category',
      label: 'The Five Phases',
      collapsed: false,
      items: [
        'phases/preparation',
        'phases/discover',
        'phases/disrupt',
        'phases/build',
        'phases/deliver',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/prompts',
        'reference/agents',
        'reference/templates',
        'reference/mcp',
        'reference/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
