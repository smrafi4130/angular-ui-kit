import { inject, Injectable, TemplateRef } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/overlay';

export interface UiDialogConfig<D = unknown> {
  data?: D;
  ariaLabel?: string;
  /** "alertdialog" disables close-on-backdrop; use for destructive confirms. */
  role?: 'dialog' | 'alertdialog';
}

/**
 * Thin wrapper over @angular/cdk/dialog, which provides the accessible overlay:
 * focus trap, focus restore, Escape handling, aria-modal and scroll blocking.
 * The wrapper fixes house defaults (panel class, role-aware backdrop) so every
 * dialog in the app behaves the same.
 */
@Injectable({ providedIn: 'root' })
export class UiDialogService {
  private readonly cdkDialog = inject(Dialog);

  open<T, D = unknown, R = unknown>(
    content: ComponentType<T> | TemplateRef<T>,
    config: UiDialogConfig<D> = {},
  ): DialogRef<R, T> {
    return this.cdkDialog.open<R, D, T>(content, {
      data: config.data,
      role: config.role ?? 'dialog',
      ariaLabel: config.ariaLabel,
      panelClass: 'ui-dialog__panel',
      backdropClass: 'ui-dialog__backdrop',
      disableClose: config.role === 'alertdialog',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      ariaModal: true,
    });
  }
}

export { DialogRef } from '@angular/cdk/dialog';
export type UiDialogContent<T> = ComponentType<T> | TemplateRef<T>;
