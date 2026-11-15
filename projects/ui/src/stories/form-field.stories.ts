import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UiFormField } from '../lib/form-field/form-field';
import { UiControl } from '../lib/form-field/control';

const meta: Meta<UiFormField> = {
  title: 'Components/FormField',
  component: UiFormField,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [UiControl] })],
};
export default meta;
type Story = StoryObj<UiFormField>;

export const WithHint: Story = {
  render: () => ({
    template: `<div style="max-width:320px">
      <ui-form-field label="Email" hint="We never share it." [required]="true">
        <input uiControl type="email" placeholder="you@example.com" />
      </ui-form-field></div>`,
  }),
};
export const WithError: Story = {
  render: () => ({
    template: `<div style="max-width:320px">
      <ui-form-field label="Password" error="Must be at least 12 characters">
        <input uiControl type="password" value="short" />
      </ui-form-field></div>`,
  }),
};
