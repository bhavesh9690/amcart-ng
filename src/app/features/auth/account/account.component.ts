import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUserRoles } from '../../../store/auth/auth.selectors';
import { AuthService } from '../../../core/auth/auth.service';
import { UserProfile } from '../../../core/models/auth.model';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  profile: UserProfile | null = null;
  userRoles$!: Observable<string[]>;
  loading = true;
  error: string | null = null;

  constructor(private store: Store, private authService: AuthService) {}

  ngOnInit(): void {
    this.userRoles$ = this.store.select(selectUserRoles);
    this.authService.getUserProfile().subscribe({
      next: profile => {
        this.profile = profile;
        this.loading = false;
      },
      error: err => {
        this.error = 'Could not load profile. Please try again.';
        this.loading = false;
        console.error('[AmCart] getUserProfile error:', err);
      }
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}

