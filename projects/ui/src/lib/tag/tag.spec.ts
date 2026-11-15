import { TestBed } from '@angular/core/testing';
import { UiTag } from './tag';

describe('UiTag', () => {
  it('applies the tone class', () => {
    const fixture = TestBed.configureTestingModule({ imports: [UiTag] }).createComponent(UiTag);
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).classList).toContain('ui-tag--danger');
  });
});
