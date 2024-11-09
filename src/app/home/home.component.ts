import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatIconComponent } from '../svgs/stat-icon/stat-icon.component';
import { GdgLogoComponent } from '../svgs/gdg-logo/gdg-logo.component';
import { LogoutIconComponent } from '../svgs/logout-icon/logout-icon.component';
import { CheckInModalComponent } from '../check-in-modal/check-in-modal.component';
import { CheckInSuccessComponent } from '../check-in-success/check-in-success.component';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';
import { Router } from '@angular/router';


interface Attendee {
  id: string;
  initials: string;
  fullName: string;
  ticket: string;
  email: string;
  checked: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, StatIconComponent, GdgLogoComponent, LogoutIconComponent, CheckInModalComponent, CheckInSuccessComponent, LogoutModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  searchQuery = '';
  isSuccessModalOpen = true;

  selectedAttendeeUser = {
    fullName: "Babatunde LAMIDI",
    ticketType: "2 Day Ticket",
    ticket: "ID: 3343434",
    initials: "BA"
  }

  isLogout = false;
  private router = inject(Router)
  attendees: Attendee[] = [
    {
      id: '1',
      initials: 'TA',
      fullName: 'Temitope Aiyegbusi',
      email: 'aiyegbusi@example.com',
      ticket: '23232323',
      checked: false
    },
    {
      id: '2',
      initials: 'SA',
      fullName: 'Sodiq Akinjobi',
      ticket: '23232323',
      email: 'sodiqakinjobi@example.com',
      checked: false
    },
    // Add more attendees...
  ];
  filteredAttendees: Attendee[] = this.attendees;

  isModalOpen = false;
  selectedAttendeeName = '';
  selectedAttendee: Attendee | null = null;

  filterAttendees() {
    const query = this.searchQuery.toLowerCase();
    this.filteredAttendees = this.attendees.filter(attendee =>
      attendee.fullName.toLowerCase().includes(query) ||
      attendee.email.toLowerCase().includes(query)
    );
  }

  toggleAttendee(attendee: Attendee) {
    attendee.checked = !attendee.checked;
    this.openCheckInModal(attendee)
  }

  openCheckInModal(attendee: Attendee) {
    this.selectedAttendee = attendee;
    this.selectedAttendeeName = attendee.fullName;
    this.isModalOpen = true;
  }

  confirmCheckIn() {
    if (this.selectedAttendee) {
      this.toggleAttendee(this.selectedAttendee);
      this.selectedAttendee.checked = true;
      this.isModalOpen = false;
      this.isSuccessModalOpen = true;
    }
    this.closeModal();
  }

  cancelCheckIn() {
    this.closeModal();
  }

  private closeModal() {
    this.isModalOpen = false;
    this.selectedAttendee = null;
    this.selectedAttendeeName = '';
  }


  closeSuccessModal() {
    this.isSuccessModalOpen = false;
    this.selectedAttendee = null;
  }

  closeLogoutModal() {
    this.isLogout = false;
    this.selectedAttendee = null;
  }

  handleLogout() {
    this.isLogout = false;
    this.router.navigate(['/login'])
  }
}
