import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiButton } from './button';

@Component({
  standalone: true,
  imports: [UiButton],
  template: `<button uiButton [variant]="variant" [loading]="loading">Go</button>`,
})
class Host {
  variant: 'primary' | 'danger' = 'primary';
  loading = false;
}

describe('UiButton', () => {
  function setup() {
    const fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    return { fixture, btn };
  }

  it('applies variant and base classes to the host button', () => {
    const { btn } = setup();
    expect(btn.classList).toContain('ui-button');
    expect(btn.classList).toContain('ui-button--primary');
    expect(btn.classList).toContain('ui-button--md');
  });

  it('sets aria-busy and renders a spinner while loading', () => {
    const { fixture, btn } = setup();
    fixture.componentInstance.loading = true;
    fixture.detectChanges();
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect(btn.querySelector('.ui-button__spinner')).toBeTruthy();
  });
});
