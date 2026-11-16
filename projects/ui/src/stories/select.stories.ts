import type { Meta, StoryObj } from '@storybook/angular';
import { UiSelect } from '../lib/select/select';

const meta: Meta<UiSelect> = {
  title: 'Components/Select',
  component: UiSelect,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<ui-select [options]="options" [placeholder]="placeholder" />`,
  }),
  args: {
    placeholder: 'Select a status',
    options: [
      { value: 'open', label: 'Open' },
      { value: 'doing', label: 'In progress' },
      { value: 'blocked', label: 'Blocked', disabled: true },
      { value: 'done', label: 'Done' },
    ],
  },
};
export default meta;
export const Default: StoryObj<UiSelect> = {};
