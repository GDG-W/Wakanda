import { Component, inject } from '@angular/core';
import { OnboardingIconComponent } from '../svgs/onboarding-icon/onboarding-icon.component';
import { GdgLogoComponent } from '../svgs/gdg-logo/gdg-logo.component';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [OnboardingIconComponent,GdgLogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  isLoading = false;
  error: string | null = null;


  handleLogin() {
    this.isLoading = true;
    this.error = null;
    const payload = {
      email_address: "email@gmail.com",
      id: "kruse"
    }

    this.authService.login(payload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
   
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

}
