import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService, SnackbarMessage } from '../../services/snackbar.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent {
  message: SnackbarMessage | null = null;
  visible = false;
  private hideTimer: any;

  constructor(private snackbar: SnackbarService) {
    this.snackbar.messages.subscribe(m => this.showMessage(m));
  }

  private showMessage(m: SnackbarMessage) {
    this.clearTimer();
    this.message = m;
    this.visible = true;
    this.hideTimer = setTimeout(() => this.hide(), m.duration ?? 3000);
  }

  hide() {
    this.visible = false;
    this.clearTimer();
    setTimeout(() => (this.message = null), 300);
  }

  private clearTimer() {
    if (this.hideTimer) { clearTimeout(this.hideTimer); this.hideTimer = null; }
  }
}
