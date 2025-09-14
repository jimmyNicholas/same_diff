import type { Decorator, Preview } from '@storybook/nextjs'
import '../src/app/globals.css'
import { MockVocabularyProvider } from '../src/test-utils/MockProvider';
import React from 'react';

const withVocabularyProvider: Decorator = (Story) => (
  <MockVocabularyProvider>
    <Story />
  </MockVocabularyProvider>
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