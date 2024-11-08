import { Component, inject, OnInit } from '@angular/core';
import { DevfestLogoComponent } from '../svgs/devfest-logo/devfest-logo.component';
import { StarIconComponent } from '../svgs/star-icon/star-icon.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [DevfestLogoComponent, StarIconComponent],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss'
})
export class SplashComponent implements OnInit{
  private router = inject(Router)

  ngOnInit(): void { 
    // setTimeout(() => {
    //   this.router.navigate(['/onboarding'])
    // }, 2000);
  }

}
