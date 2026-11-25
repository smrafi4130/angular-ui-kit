import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiToastService } from './toast.service';
import { UiToastItemComponent } from './toast-item';

/**
 * Renders active toasts in a fixed, polite live region. Place once near the app
 * root: <ui-toast-viewport />.
 */
@Component({
  selector: 'ui-toast-viewport',
  standalone: true,
  imports: [UiToastItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="ui-toast__viewport" aria-label="Notifications">
      @for (toast of service.toasts(); track toast.id) {
        <li>
          <ui-toast-item [toast]="toast" (dismiss)="service.dismiss(toast.id)" />
        </li>
      }
    </ol>
  `,
  styleUrl: './toast.scss',
})
export class UiToastViewport {
  protected readonly service = inject(UiToastService);
}
