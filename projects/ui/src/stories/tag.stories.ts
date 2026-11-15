import type { Meta, StoryObj } from '@storybook/angular';
import { UiTag } from '../lib/tag/tag';

const meta: Meta<UiTag> = {
  title: 'Components/Tag',
  component: UiTag,
  tags: ['autodocs'],
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'accent', 'success', 'danger'] } },
  render: (args) => ({ props: args, template: `<ui-tag [tone]="tone">{{ tone }}</ui-tag>` }),
};
export default meta;
type Story = StoryObj<UiTag>;

export const Neutral: Story = { args: { tone: 'neutral' } };
export const All: Story = {
  render: () => ({
    template: `<div style="display:flex;gap:8px">
      <ui-tag tone="neutral">neutral</ui-tag><ui-tag tone="accent">accent</ui-tag>
      <ui-tag tone="success">success</ui-tag><ui-tag tone="danger">danger</ui-tag>
    </div>`,
  }),
};
