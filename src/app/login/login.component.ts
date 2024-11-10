import { Component, computed, effect, inject, signal } from '@angular/core';
import { OnboardingIconComponent } from '../svgs/onboarding-icon/onboarding-icon.component';
import { GdgLogoComponent } from '../svgs/gdg-logo/gdg-logo.component';
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EyeCloseIconComponent } from '../svgs/eye-close-icon/eye-close-icon.component';
import { EyeIconComponent } from '../svgs/eye-icon/eye-icon.component';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

interface LoginForm {
  email: string;
  id: string;
}

interface ValidationError {
  field: 'email' | 'id';
  message: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [OnboardingIconComponent,GdgLogoComponent, ReactiveFormsModule, EyeCloseIconComponent, EyeIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router)

  // Signals
  isLoading = signal(false);
  showPassword = signal(false);
  apiError = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    id: ['', [Validators.required]]
  });

  // Computed value for form validity
  isFormValid = computed(() => {
    return this.loginForm.valid;
  });

  constructor() {
    effect(() => {
  
    });
  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }
  handleLogin() {
    const formValue = this.loginForm.value;
    this.isLoading.set(true);
    this.apiError.set(null)

    this.authService.login({
      email_address: formValue.email,
      id: formValue.id
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (response) => {
        this.router.navigate(['/home'])
        localStorage.setItem("user", JSON.stringify(response))
      },
      error: (error) => {
        this.apiError.set(error.error?.message || 'An error occurred during login');
        console.error('Login error:', error);
        this.router.navigate(['/home'])
      }
    });
  }
  

}
