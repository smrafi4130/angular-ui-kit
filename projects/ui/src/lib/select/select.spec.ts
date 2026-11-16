import { Component, signal } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, flush } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiSelect, type UiSelectOption } from './select';

const OPTIONS: UiSelectOption[] = [
  { value: 'open', label: 'Open' },
  { value: 'doing', label: 'In progress' },
  { value: 'blocked', label: 'Blocked', disabled: true },
  { value: 'done', label: 'Done' },
];

@Component({
  standalone: true,
  imports: [UiSelect, ReactiveFormsModule],
  template: `<ui-select [options]="options()" [formControl]="control" placeholder="Pick one" />`,
})
class Host {
  options = signal(OPTIONS);
  control = new FormControl<string | null>(null);
}

describe('UiSelect', () => {
  let fixture: ComponentFixture<Host>;
  let host: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });
  afterEach(() => document.querySelectorAll('.cdk-overlay-container').forEach((n) => n.remove()));

  const trigger = () => host.querySelector<HTMLButtonElement>('.ui-select__trigger')!;
  const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]');
  const options = () => Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'));

  it('is a closed combobox with the placeholder until opened', () => {
    expect(trigger().getAttribute('role')).toBe('combobox');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().textContent).toContain('Pick one');
    expect(listbox()).toBeNull();
  });

  it('opens on click and renders options with listbox semantics', () => {
    trigger().click();
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(listbox()).not.toBeNull();
    expect(options().length).toBe(4);
    expect(options()[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('selects an option, updates the form control, and closes', () => {
    trigger().click();
    fixture.detectChanges();
    options()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('doing');
    expect(trigger().textContent).toContain('In progress');
    expect(listbox()).toBeNull();
  });

  it('writes an initial value from the form control into the trigger label', () => {
    fixture.componentInstance.control.setValue('done');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Done');
  });

  // CDK's ListKeyManager switches on event.keyCode, which synthetic events don't
  // populate (real browser events do), so set it alongside key.
  const KEY_CODE: Record<string, number> = { ArrowDown: 40, ArrowUp: 38, Enter: 13, Escape: 27 };

  it('keyboard: ArrowDown opens, moves active (skipping disabled), Enter selects', fakeAsync(() => {
    const press = (key: string) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      Object.defineProperty(event, 'keyCode', { get: () => KEY_CODE[key] });
      trigger().dispatchEvent(event);
      fixture.detectChanges();
      flush();
    };
    press('ArrowDown'); // opens, active = current or first
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    press('ArrowDown'); // open -> doing
    press('ArrowDown'); // skip disabled blocked -> done
    press('Enter');
    expect(fixture.componentInstance.control.value).toBe('done');
  }));

  it('reflects disabled state from the form control', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(trigger().disabled).toBe(true);
  });
});
