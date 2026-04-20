import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../../../core/models/auth.model';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pw && confirm && pw !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {}

  get passwordGroup(): FormGroup {
    return this.registerForm.get('passwordGroup') as FormGroup;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      mobile:    ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{7,14}$/)]],
      gender:    ['', Validators.required],
      passwordGroup: this.fb.group(
        {
          password:        ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required]
        },
        { validators: passwordMatchValidator }
      )
    });

    this.isLoading$ = this.store.select(selectAuthLoading);
    this.error$     = this.store.select(selectAuthError);
  }

  get f() { return this.registerForm.controls; }

  onRegister(): void {
    if (this.registerForm.invalid) return;
    const payload: RegisterRequest = {
      firstName: this.f['firstName'].value,
      lastName:  this.f['lastName'].value,
      email:     this.f['email'].value,
      mobile:    this.f['mobile'].value,
      gender:    this.f['gender'].value,
      password:  this.passwordGroup.get('password')!.value
    };
    this.store.dispatch(AuthActions.register({ data: payload }));
  }
}
