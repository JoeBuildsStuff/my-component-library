import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { owner, repo } from '@/lib/github';
import Logo from 'registry/ui/logo';
import { Puzzle } from 'lucide-react';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Logo icon={Puzzle} text="JT Components" />
      </>
    ),
  },
  githubUrl: `https://github.com/${owner}/${repo}`,
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    {
      text: 'Docs',
      url: '/docs',
      // secondary items will be displayed differently on navbar
      secondary: false,
    },
  ],
};
