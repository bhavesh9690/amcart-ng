import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface SnackbarMessage {
  text: string;
  duration?: number; // ms
  type?: 'success' | 'info' | 'error';
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private messages$ = new Subject<SnackbarMessage>();

  get messages(): Observable<SnackbarMessage> {
    return this.messages$.asObservable();
  }

  show(text: string, opts?: { duration?: number; type?: 'success'|'info'|'error' }) {
    this.messages$.next({ text, duration: opts?.duration ?? 3000, type: opts?.type ?? 'info' });
  }
}
