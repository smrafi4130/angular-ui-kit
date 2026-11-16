import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  input,
  model,
  signal,
  viewChild,
  ViewChildren,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOptionComponent } from './select-option';

export interface UiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

let uid = 0;

/**
 * Accessible single-select (WAI-ARIA combobox + listbox) built on Angular CDK:
 *  - CDK Overlay for the popup (positioned, flips on collision)
 *  - ActiveDescendantKeyManager for keyboard navigation + typeahead, with
 *    `aria-activedescendant` (focus stays on the trigger)
 *  - implements ControlValueAccessor, so it works with reactive & template forms
 *
 * Keys: Enter/Space/ArrowDown open; ArrowUp/Down/Home/End move; type to jump;
 * Enter selects; Escape closes.
 */
@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CdkOverlayOrigin, CdkConnectedOverlay, SelectOptionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSelect), multi: true }],
  templateUrl: './select.html',
  host: { class: 'ui-select' },
  styleUrl: './select.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiSelect implements ControlValueAccessor, AfterViewInit {
  readonly options = input.required<UiSelectOption[]>();
  readonly placeholder = input('Select…');
  readonly value = model<string | null>(null);

  readonly open = signal(false);
  readonly disabled = signal(false);
  readonly listboxId = `ui-select-list-${uid++}`;

  readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('triggerEl');
  @ViewChildren(SelectOptionComponent) private optionEls!: QueryList<SelectOptionComponent>;
  private keyManager?: ActiveDescendantKeyManager<SelectOptionComponent>;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.keyManager = new ActiveDescendantKeyManager<SelectOptionComponent>(this.optionEls)
      .withWrap()
      .withTypeAhead()
      .skipPredicate((o) => o.optionDisabled());
  }

  get selectedLabel(): string | null {
    return this.options().find((o) => o.value === this.value())?.label ?? null;
  }
  get activeId(): string | null {
    return this.open() ? (this.keyManager?.activeItem?.id ?? null) : null;
  }

  toggle(): void {
    if (this.open()) this.close();
    else this.openPanel();
  }

  openPanel(): void {
    if (this.disabled()) return;
    this.open.set(true);
    queueMicrotask(() => {
      const index = this.options().findIndex((o) => o.value === this.value());
      if (index >= 0) this.keyManager?.setActiveItem(index);
      else this.keyManager?.setFirstItemActive();
    });
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.onTouched();
    this.trigger().nativeElement.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        this.openPanel();
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const active = this.keyManager?.activeItem;
      if (active) this.selectValue(active.value());
    } else {
      this.keyManager?.onKeydown(event);
    }
  }

  selectValue(value: string): void {
    this.value.set(value);
    this.onChange(value);
    this.close();
  }

  writeValue(value: string | null): void {
    this.value.set(value);
  }
  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
