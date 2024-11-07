import { Component, inject } from '@angular/core';
import { OnboardingIconComponent } from '../svgs/onboarding-icon/onboarding-icon.component';
import { GdgLogoComponent } from '../svgs/gdg-logo/gdg-logo.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [OnboardingIconComponent,GdgLogoComponent],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {
  private router = inject(Router)


  gotoLogin() {
    this.router.navigate(['/login'])
  }
}
