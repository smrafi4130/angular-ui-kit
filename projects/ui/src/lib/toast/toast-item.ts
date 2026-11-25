import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type { UiToast } from './toast.service';

/**
 * A single toast. Auto-dismisses after `duration`, but pauses while hovered or
 * focused (WCAG 2.2.1). Errors use `role="alert"` (interrupts); others use
 * `role="status"` (polite).
 */
@Component({
  selector: 'ui-toast-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ui-toast"
      [class]="'ui-toast--' + toast().tone"
      [attr.role]="toast().tone === 'danger' ? 'alert' : 'status'"
      aria-atomic="true"
      (mouseenter)="paused.set(true)"
      (mouseleave)="paused.set(false)"
      (focusin)="paused.set(true)"
      (focusout)="paused.set(false)"
    >
      <div class="ui-toast__body">
        <p class="ui-toast__title">{{ toast().title }}</p>
        @if (toast().description) {
          <p class="ui-toast__desc">{{ toast().description }}</p>
        }
      </div>
      <button type="button" class="ui-toast__close" aria-label="Dismiss notification" (click)="dismiss.emit()">
        &times;
      </button>
    </div>
  `,
  styleUrl: './toast.scss',
})
export class UiToastItemComponent {
  readonly toast = input.required<UiToast>();
  readonly dismiss = output<void>();

  protected readonly paused = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
    effect(() => {
      const { duration } = this.toast();
      clearTimeout(this.timer);
      if (this.paused() || !Number.isFinite(duration)) return;
      this.timer = setTimeout(() => this.dismiss.emit(), duration);
    });
  }
}
