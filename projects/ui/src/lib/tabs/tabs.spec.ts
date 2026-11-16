import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UiTabs } from './tabs';
import { UiTab } from './tab';

@Component({
  standalone: true,
  imports: [UiTabs, UiTab],
  template: `
    <ui-tabs [(active)]="active">
      <ui-tab label="Overview">Overview content</ui-tab>
      <ui-tab label="Issues">Issues content</ui-tab>
      <ui-tab label="Archived" [disabled]="true">Archived content</ui-tab>
      <ui-tab label="Settings">Settings content</ui-tab>
    </ui-tabs>
  `,
})
class Host {
  active = 0;
}

describe('UiTabs', () => {
  let fixture: ComponentFixture<Host>;
  let el: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  const tabs = () => Array.from(el.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = () => Array.from(el.querySelectorAll<HTMLElement>('[role="tabpanel"]'));

  it('wires tab/tabpanel aria relationships and shows only the active panel', () => {
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[0].getAttribute('aria-controls')).toBe(panels()[0].id);
    expect(panels()[0].getAttribute('aria-labelledby')).toBe(tabs()[0].id);
    expect(panels()[0].hidden).toBe(false);
    expect(panels()[1].hidden).toBe(true);
    expect(panels()[0].textContent).toContain('Overview content');
    // Inactive panel content is not rendered.
    expect(panels()[1].textContent).not.toContain('Issues content');
  });

  it('uses a roving tabindex', () => {
    expect(tabs()[0].getAttribute('tabindex')).toBe('0');
    expect(tabs()[1].getAttribute('tabindex')).toBe('-1');
  });

  it('selects on click and reflects the two-way model', () => {
    tabs()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe(1);
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
    expect(panels()[1].hidden).toBe(false);
  });

  it('does not select a disabled tab', () => {
    tabs()[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe(0);
  });

  it('moves with arrow keys, skipping disabled tabs, and wraps', () => {
    const list = el.querySelector('[role="tablist"]')!;
    const press = (key: string) => {
      list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    };
    press('ArrowRight');
    expect(fixture.componentInstance.active).toBe(1); // Overview -> Issues
    press('ArrowRight');
    expect(fixture.componentInstance.active).toBe(3); // skips disabled Archived -> Settings
    press('ArrowRight');
    expect(fixture.componentInstance.active).toBe(0); // wraps to Overview
    press('End');
    expect(fixture.componentInstance.active).toBe(3);
    press('Home');
    expect(fixture.componentInstance.active).toBe(0);
  });
});
