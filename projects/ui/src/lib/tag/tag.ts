import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type UiTagTone = 'neutral' | 'accent' | 'success' | 'danger';

@Component({
  selector: 'ui-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'ui-tag', '[class]': 'toneClass()' },
  styleUrl: './tag.scss',
})
export class UiTag {
  readonly tone = input<UiTagTone>('neutral');
  protected readonly toneClass = computed(() => `ui-tag--${this.tone()}`);
}
