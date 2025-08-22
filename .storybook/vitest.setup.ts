import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as projectAnnotations from './preview';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

// Global test setup
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

// Make expect available globally
global.expect = expect;