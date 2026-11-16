import { ChangeDetectionStrategy, Component, input, signal, TemplateRef, viewChild } from '@angular/core';

let uid = 0;

/**
 * A single tab. Its projected content is captured as a template and rendered by
 * the parent <ui-tabs> only when the tab is active, so inactive panels (and any
 * work they do) are not in the DOM.
 */
@Component({
  selector: 'ui-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #content><ng-content /></ng-template>`,
})
export class UiTab {
  readonly label = input.required<string>();
  readonly disabled = input(false);

  readonly content = viewChild.required<TemplateRef<unknown>>('content');
  readonly active = signal(false);

  private readonly n = uid++;
  readonly tabId = `ui-tab-${this.n}`;
  readonly panelId = `ui-tabpanel-${this.n}`;
}

