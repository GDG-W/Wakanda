import { Component } from '@angular/core';
import { OnboardingIconComponent } from '../svgs/onboarding-icon/onboarding-icon.component';
import { GdgLogoComponent } from '../svgs/gdg-logo/gdg-logo.component';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [OnboardingIconComponent,GdgLogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
