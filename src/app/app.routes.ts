import { Routes } from '@angular/router';
import { SplashComponent } from './splash/splash.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: '', redirectTo: '/splash', pathMatch: 'full'},
    { path: 'splash', component: SplashComponent },
    { path: 'login', component: LoginComponent },
];
