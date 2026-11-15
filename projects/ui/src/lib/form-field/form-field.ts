import { ChangeDetectionStrategy, Component, contentChild, effect, input } from '@angular/core';
import { UiControl } from './control';

let uid = 0;

/**
 * Associates a label, optional hint and error with a projected control carrying
 * the `uiControl` directive, generating ids and wiring `aria-describedby` /
 * `aria-invalid` so consumers can't forget them.
 *
 *   <ui-form-field label="Email" [error]="emailError()">
 *     <input uiControl type="email" [formControl]="email" />
 *   </ui-form-field>
 */
@Component({
  selector: 'ui-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="ui-form-field__label" [attr.for]="controlId">
      {{ label() }}@if (required()) {<span aria-hidden="true"> *</span>}
    </label>
    @if (hint()) {
      <p class="ui-form-field__hint" [id]="hintId">{{ hint() }}</p>
    }
    <ng-content select="[uiControl]" />
    @if (error()) {
      <p class="ui-form-field__error" role="alert" [id]="errorId">{{ error() }}</p>
    }
  `,
  host: { class: 'ui-form-field' },
  styleUrl: './form-field.scss',
})
export class UiFormField {
  readonly label = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly required = input(false);

  private readonly n = uid++;
  readonly controlId = `ui-field-${this.n}`;
  readonly hintId = `ui-field-${this.n}-hint`;
  readonly errorId = `ui-field-${this.n}-error`;

  private readonly control = contentChild(UiControl);

  constructor() {
    // Re-sync aria wiring whenever hint/error change (signals read in effect).
    effect(() => {
      const control = this.control();
      if (!control) return;
      control.setId(this.controlId);
      const describedBy = [this.hint() ? this.hintId : '', this.error() ? this.errorId : '']
        .filter(Boolean)
        .join(' ');
      control.setAria(describedBy, Boolean(this.error()));
    });
  }

}
