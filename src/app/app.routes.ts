import { Routes } from '@angular/router';
import { SplashComponent } from './splash/splash.component';
import { LoginComponent } from './login/login.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { HomeComponent } from './home/home.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';

export const routes: Routes = [
    {path: '', redirectTo: '/splash', pathMatch: 'full'},
    { path: 'splash', component: SplashComponent },
    { path: 'onboarding', component: OnboardingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'qr-scanner', component: QrScannerComponent },
];
