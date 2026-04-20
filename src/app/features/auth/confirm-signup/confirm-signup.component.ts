import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-confirm-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './confirm-signup.component.html',
  styleUrl: './confirm-signup.component.scss'
})
export class ConfirmSignupComponent implements OnInit {
  confirmForm!: FormGroup;
  prefillEmail = '';
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.prefillEmail = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.confirmForm = this.fb.group({
      email: [this.prefillEmail, [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  get f() { return this.confirmForm.controls; }

  onConfirm(): void {
    if (this.confirmForm.invalid) return;
    this.store.dispatch(AuthActions.confirmSignUp({
      req: { email: this.confirmForm.value.email, code: this.confirmForm.value.code }
    }));
  }
}
