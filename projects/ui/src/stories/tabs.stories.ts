import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UiTabs } from '../lib/tabs/tabs';
import { UiTab } from '../lib/tab/../tabs/tab';

const meta: Meta<UiTabs> = {
  title: 'Components/Tabs',
  component: UiTabs,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [UiTab] })],
};
export default meta;
type Story = StoryObj<UiTabs>;

export const Default: Story = {
  render: () => ({
    template: `
      <ui-tabs>
        <ui-tab label="Overview">Project summary and recent activity.</ui-tab>
        <ui-tab label="Issues">Open issues for this project.</ui-tab>
        <ui-tab label="Archived" [disabled]="true">Archived items.</ui-tab>
        <ui-tab label="Settings">Project settings.</ui-tab>
      </ui-tabs>`,
  }),
};
