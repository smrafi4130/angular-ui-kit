import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { moduleMetadata } from '@storybook/angular';
import { UiToastService } from '../lib/toast/toast.service';
import { UiToastViewport } from '../lib/toast/toast-viewport';
import { UiButton } from '../lib/button/button';

@Component({
  selector: 'toast-demo',
  standalone: true,
  imports: [UiToastViewport, UiButton],
  template: `
    <div style="display:flex;gap:8px">
      <button uiButton (click)="svc.success('Project saved')">Success</button>
      <button uiButton variant="danger" (click)="svc.danger('Could not save', 'Network error. Try again.')">Error</button>
      <button uiButton variant="secondary" (click)="svc.show({ title: 'Heads up', description: 'This is a neutral toast.' })">Neutral</button>
    </div>
    <ui-toast-viewport />
  `,
})
class ToastDemo {
  protected readonly svc = inject(UiToastService);
}

const meta: Meta = {
  title: 'Components/Toast',
  decorators: [moduleMetadata({ imports: [ToastDemo] })],
  render: () => ({ template: `<toast-demo />` }),
};
export default meta;
export const Default: StoryObj = {};
