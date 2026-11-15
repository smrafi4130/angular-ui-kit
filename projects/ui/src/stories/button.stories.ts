import type { Meta, StoryObj } from '@storybook/angular';
import { UiButton } from '../lib/button/button';

const meta: Meta<UiButton> = {
  title: 'Components/Button',
  component: UiButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    loading: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<button uiButton [variant]="variant" [size]="size" [loading]="loading">Save changes</button>`,
  }),
};
export default meta;
type Story = StoryObj<UiButton>;

export const Primary: Story = { args: { variant: 'primary', size: 'md', loading: false } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Loading: Story = { args: { loading: true } };
export const AllVariants: Story = {
  render: () => ({
    template: `<div style="display:flex;gap:12px;flex-wrap:wrap">
      <button uiButton variant="primary">Primary</button>
      <button uiButton variant="secondary">Secondary</button>
      <button uiButton variant="ghost">Ghost</button>
      <button uiButton variant="danger">Danger</button>
      <button uiButton disabled>Disabled</button>
    </div>`,
  }),
};
