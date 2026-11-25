import { Component, inject } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { UiToastService } from './toast.service';
import { UiToastViewport } from './toast-viewport';

@Component({
  standalone: true,
  imports: [UiToastViewport],
  template: `<ui-toast-viewport />`,
})
class Host {
  readonly service = inject(UiToastService);
}

describe('UiToast', () => {
  let fixture: ComponentFixture<Host>;
  let svc: UiToastService;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    svc = fixture.componentInstance.service;
    svc.clear();
    fixture.detectChanges();
  });

  const toasts = () => Array.from(fixture.nativeElement.querySelectorAll('.ui-toast')) as HTMLElement[];

  it('renders a toast with the correct live-region role per tone', () => {
    svc.success('Saved');
    fixture.detectChanges();
    expect(toasts()[0].getAttribute('role')).toBe('status');
    expect(toasts()[0].textContent).toContain('Saved');

    svc.danger('Failed', 'Try again');
    fixture.detectChanges();
    const danger = toasts().find((t) => t.classList.contains('ui-toast--danger'))!;
    expect(danger.getAttribute('role')).toBe('alert');
    expect(danger.textContent).toContain('Try again');
  });

  it('auto-dismisses after the duration', fakeAsync(() => {
    svc.show({ title: 'Bye', duration: 1000 });
    fixture.detectChanges();
    expect(toasts().length).toBe(1);
    tick(1000);
    fixture.detectChanges();
    expect(toasts().length).toBe(0);
  }));

  it('pauses auto-dismiss while hovered', fakeAsync(() => {
    svc.show({ title: 'Hold', duration: 1000 });
    fixture.detectChanges();
    toasts()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
    expect(toasts().length).toBe(1); // still there while hovered

    toasts()[0].dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(toasts().length).toBe(0);
  }));

  it('keeps a toast with Infinity duration until dismissed', fakeAsync(() => {
    const id = svc.show({ title: 'Sticky', duration: Infinity });
    fixture.detectChanges();
    tick(10000);
    fixture.detectChanges();
    expect(toasts().length).toBe(1);
    svc.dismiss(id);
    fixture.detectChanges();
    expect(toasts().length).toBe(0);
  }));

  it('caps the number of visible toasts to the limit', () => {
    svc.limit = 2;
    svc.show({ title: 'a', duration: Infinity });
    svc.show({ title: 'b', duration: Infinity });
    svc.show({ title: 'c', duration: Infinity });
    fixture.detectChanges();
    expect(toasts().length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('c');
    expect(fixture.nativeElement.textContent).not.toContain('a');
  });

  it('dismisses via the close button', () => {
    svc.show({ title: 'Close me', duration: Infinity });
    fixture.detectChanges();
    (toasts()[0].querySelector('.ui-toast__close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(toasts().length).toBe(0);
  });
});
