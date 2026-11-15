import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type UiButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type UiButtonSize = 'sm' | 'md';

/**
 * Attribute-selector button applied to a native <button>, so type, disabled,
 * focus and keyboard behaviour come from the platform. Styling and a loading
 * state are layered on via host bindings.
 *
 *   <button uiButton variant="danger" [loading]="saving()">Delete</button>
 */
@Component({
  selector: 'button[uiButton], a[uiButton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <span class="ui-button__spinner" aria-hidden="true"></span>
    }
    <ng-content />
  `,
  host: {
    class: 'ui-button',
    '[class]': 'classes()',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.data-loading]': 'loading() || null',
  },
  styleUrl: './button.scss',
})
export class UiButton {
  readonly variant = input<UiButtonVariant>('primary');
  readonly size = input<UiButtonSize>('md');
  readonly loading = input(false);

  protected readonly classes = computed(() => `ui-button--${this.variant()} ui-button--${this.size()}`);
}
