import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiFormField } from './form-field';
import { UiControl } from './control';

@Component({
  standalone: true,
  imports: [UiFormField, UiControl],
  template: `
    <ui-form-field label="Email" [hint]="hint()" [error]="error()" [required]="true">
      <input uiControl type="email" />
    </ui-form-field>
  `,
})
class Host {
  hint = signal<string | null>('We never share it.');
  error = signal<string | null>(null);
}

describe('UiFormField', () => {
  function setup() {
    const fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, input: el.querySelector('input')! };
  }

  it('links the label to the control and describes it by the hint', () => {
    const { el, input } = setup();
    const label = el.querySelector('label')!;
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toContain(el.querySelector('.ui-form-field__hint')!.id);
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('marks the control invalid and adds the error to aria-describedby when error is set', () => {
    const { fixture, el, input } = setup();
    fixture.componentInstance.error.set('Required');
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const described = input.getAttribute('aria-describedby') ?? '';
    expect(described).toContain(el.querySelector('.ui-form-field__error')!.id);
  });
});
