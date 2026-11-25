import { Injectable, signal } from '@angular/core';

export type UiToastTone = 'neutral' | 'success' | 'danger';

export interface UiToastOptions {
  title: string;
  description?: string;
  tone?: UiToastTone;
  /** Milliseconds before auto-dismiss. `Infinity` keeps it until dismissed. Default 5000. */
  duration?: number;
}

export interface UiToast extends Required<Omit<UiToastOptions, 'description'>> {
  id: number;
  description?: string;
}

let nextId = 1;

/**
 * Toast state as a signal. `UiToastViewport` renders it; components call
 * `toast(...)`. Kept as a service (not a global) so it's injectable and testable.
 */
@Injectable({ providedIn: 'root' })
export class UiToastService {
  private readonly _toasts = signal<UiToast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  /** Cap visible toasts so a burst of errors can't bury the UI. */
  limit = 4;

  show(options: UiToastOptions): number {
    const id = nextId++;
    const toast: UiToast = {
      id,
      title: options.title,
      description: options.description,
      tone: options.tone ?? 'neutral',
      duration: options.duration ?? 5000,
    };
    this._toasts.update((list) => [...list, toast].slice(-this.limit));
    return id;
  }

  success(title: string, description?: string) {
    return this.show({ title, description, tone: 'success' });
  }
  danger(title: string, description?: string) {
    return this.show({ title, description, tone: 'danger' });
  }

  dismiss(id: number): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }
  clear(): void {
    this._toasts.set([]);
  }
}
