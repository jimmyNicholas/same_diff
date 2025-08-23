import type { Decorator, Preview } from '@storybook/nextjs'
import '../src/app/globals.css'
import { VocabularyProvider } from '../src/lib/contexts/VocabularyContext';
import React from 'react';

const withVocabularyProvider: Decorator = (Story) => (
  <VocabularyProvider>
    <Story />
  </VocabularyProvider>
);

const preview: Preview = {
  decorators: [withVocabularyProvider],
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
  },
};

export default preview;