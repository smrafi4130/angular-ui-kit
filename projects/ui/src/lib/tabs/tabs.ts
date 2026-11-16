import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  model,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { UiTab } from './tab';

/**
 * Accessible tabs (WAI-ARIA tabs pattern):
 *  - `role="tablist"` with `tab`/`tabpanel` wiring and `aria-controls`/`aria-labelledby`
 *  - roving tabindex: only the active tab is in the Tab order; Arrow/Home/End move
 *    between tabs (skipping disabled ones) and select on focus
 *  - `active` is a two-way model, so it works as `[(active)]` or uncontrolled
 *
 *   <ui-tabs [(active)]="index">
 *     <ui-tab label="Overview">…</ui-tab>
 *     <ui-tab label="Issues">…</ui-tab>
 *   </ui-tabs>
 */
@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Focus lives on the child tab buttons (roving tabindex); the tablist only delegates arrow keys. -->
    <!-- eslint-disable-next-line @angular-eslint/template/interactive-supports-focus -->
    <div class="ui-tabs__list" role="tablist" (keydown)="onKeydown($event)">
      @for (tab of tabs(); track tab.tabId; let i = $index) {
        <button
          type="button"
          role="tab"
          [id]="tab.tabId"
          [attr.aria-selected]="i === active()"
          [attr.aria-controls]="tab.panelId"
          [attr.tabindex]="i === active() ? 0 : -1"
          [disabled]="tab.disabled()"
          [attr.data-state]="i === active() ? 'active' : 'inactive'"
          (click)="select(i)"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    @for (tab of tabs(); track tab.panelId; let i = $index) {
      <div
        role="tabpanel"
        [id]="tab.panelId"
        [attr.aria-labelledby]="tab.tabId"
        [hidden]="i !== active()"
        tabindex="0"
      >
        @if (i === active()) {
          <ng-container [ngTemplateOutlet]="tab.content()" />
        }
      </div>
    }
  `,
  host: { class: 'ui-tabs' },
  styleUrl: './tabs.scss',
})
export class UiTabs implements AfterContentInit {
  readonly tabs = contentChildren(UiTab);
  readonly active = model(0);

  constructor() {
    // Keep each tab's own `active` signal in sync (used for styling hooks/tests).
    effect(() => {
      const current = this.active();
      this.tabs().forEach((tab, i) => tab.active.set(i === current));
    });
  }

  ngAfterContentInit(): void {
    if (this.active() >= this.tabs().length) this.active.set(0);
  }

  select(index: number): void {
    if (!this.tabs()[index]?.disabled()) this.active.set(index);
  }

  onKeydown(event: KeyboardEvent): void {
    const tabs = this.tabs();
    const enabled = tabs.map((t, i) => ({ i, disabled: t.disabled() })).filter((t) => !t.disabled);
    const pos = enabled.findIndex((t) => t.i === this.active());
    let nextPos: number | null = null;
    if (event.key === 'ArrowRight') nextPos = (pos + 1) % enabled.length;
    else if (event.key === 'ArrowLeft') nextPos = (pos - 1 + enabled.length) % enabled.length;
    else if (event.key === 'Home') nextPos = 0;
    else if (event.key === 'End') nextPos = enabled.length - 1;
    if (nextPos === null) return;
    event.preventDefault();
    const target = enabled[nextPos]!.i;
    this.active.set(target);
    const list = event.currentTarget as HTMLElement;
    list.querySelectorAll<HTMLButtonElement>('[role="tab"]')[target]?.focus();
  }
}
