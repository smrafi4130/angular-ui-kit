import { Highlightable } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

let uid = 0;

/**
 * A single option inside <ui-select>. Implements CDK's Highlightable so the
 * ActiveDescendantKeyManager can mark it active (for aria-activedescendant) and
 * match typeahead via getLabel().
 */
@Component({
  selector: 'ui-select-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ label() }}`,
  host: {
    role: 'option',
    '[id]': 'id',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-disabled]': 'optionDisabled() || null',
    '[class.ui-select__option--active]': 'active()',
    '[class.ui-select__option--disabled]': 'optionDisabled()',
    '(click)': 'pick.emit()',
    class: 'ui-select__option',
  },
})
export class SelectOptionComponent implements Highlightable {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly optionDisabled = input(false);
  readonly selected = input(false);

  readonly pick = output<void>();

  readonly id = `ui-option-${uid++}`;
  private readonly _active = signal(false);
  readonly active = computed(() => this._active());

  setActiveStyles(): void {
    this._active.set(true);
  }
  setInactiveStyles(): void {
    this._active.set(false);
  }
  getLabel(): string {
    return this.label();
  }
}
