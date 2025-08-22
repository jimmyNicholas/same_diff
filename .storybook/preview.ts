import type { Preview } from '@storybook/nextjs'
import '../src/app/globals.css'
import { sb } from 'storybook/test';

sb.mock(import('../src/lib/hooks/useVocabularyActions.tsx'), { spy: true });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    },
    // // Add this to fix the Jest matchers issue
    // test: {
    //   globals: {
    //     expect: true,
    //     vi: true,
    //   },
    //},
  },
};

export default preview;