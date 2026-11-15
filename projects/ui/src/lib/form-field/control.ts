import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Marks the form control inside a <ui-form-field>. Carries the element so the
 * field can wire ids and aria attributes onto it. Kept as a directive (not a CSS
 * query) so it is type-safe and queryable with @ContentChild.
 */
@Directive({ selector: '[uiControl]', standalone: true })
export class UiControl {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  setId(id: string): void {
    if (!this.el.nativeElement.id) this.el.nativeElement.id = id;
  }
  get id(): string {
    return this.el.nativeElement.id;
  }
  setAria(describedBy: string, invalid: boolean): void {
    const el = this.el.nativeElement;
    if (describedBy) el.setAttribute('aria-describedby', describedBy);
    else el.removeAttribute('aria-describedby');
    if (invalid) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  }
}
