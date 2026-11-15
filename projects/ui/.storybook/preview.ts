import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    backgrounds: { default: 'canvas', values: [{ name: 'canvas', value: '#ffffff' }] },
  },
  globalTypes: {
    theme: { description: 'Theme', toolbar: { icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true } },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (story, context) => {
      document.documentElement.setAttribute('data-theme', context.globals['theme'] ?? 'light');
      return story();
    },
  ],
};
export default preview;
