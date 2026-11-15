import { ApplicationRef, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiDialogService } from './dialog.service';

@Component({ standalone: true, template: `<p>Dialog body</p><button>Close</button>` })
class DialogContent {}

describe('UiDialogService', () => {
  let service: UiDialogService;
  let app: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiDialogService);
    app = TestBed.inject(ApplicationRef);
  });

  it('opens an accessible dialog with role and label, and closes it', () => {
    const ref = service.open(DialogContent, { role: 'alertdialog', ariaLabel: 'Confirm delete' });
    app.tick();
    const dialog = document.querySelector('[role="alertdialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog!.getAttribute('aria-modal')).toBe('true');
    expect(dialog!.getAttribute('aria-label')).toBe('Confirm delete');
    ref.close();
    app.tick();
    expect(document.querySelector('[role="alertdialog"]')).toBeNull();
  });
});
