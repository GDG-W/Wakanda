import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatIconComponent } from '../svgs/stat-icon/stat-icon.component';
import { GdgLogoComponent } from '../svgs/gdg-logo/gdg-logo.component';
import { LogoutIconComponent } from '../svgs/logout-icon/logout-icon.component';
import { CheckInModalComponent } from '../check-in-modal/check-in-modal.component';
import { CheckInSuccessComponent } from '../check-in-success/check-in-success.component';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { JsonPipe } from '@angular/common';


interface Ticket {
  title: string;
  tag: string;
}

interface AttendeeUser {
  id: string;
  user_id: string;
  day: number;
  checked_in_by: string;
  created_at: string;
}


interface Attendee {
  id: string;
  fullname: string;
  email_address: string;
  role: string;
  level_of_expertise: 'beginner' | 'intermediate' | 'expert';  
  shirt_size: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';        
  ticket_id: string;
  created_at: string;  
  ticket: Ticket;
  checked?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, StatIconComponent, GdgLogoComponent, LogoutIconComponent, CheckInModalComponent, CheckInSuccessComponent, LogoutModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  private router = inject(Router)
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  // selectedAttendeeUser = {
  //   // fullName: "Babatunde LAMIDI",
  //   ticketType: "",
  //   ticket: "",
  //   // initials: "BA"
  // }

  selectedAttendeeUser = signal<any>({
    ticketType: '',
    ticket: '',
  });

  isLogout = false;
  attendees: Attendee[] =  []
  filteredAttendees: Attendee[] = this.attendees;
  isModalOpen = false;
  selectedAttendeeName = '';
  selectedAttendee: Attendee | null = null;
  userInfo: any = {}
  searchQuery = '';
  isSuccessModalOpen = false;
  isLoading = signal(false);
  selectedDay = signal('1');
  checkInType = signal<'female' | 'male' | 'none'>('none');




  ngOnInit(): void { 
    this.getUserProfiles()
    this.getUserDetails()
  }

  filterAttendees() {
    const query = this.searchQuery.toLowerCase();
    this.filteredAttendees = this.attendees.filter(attendee =>
      attendee.fullname.toLowerCase().includes(query) ||
      attendee.email_address.toLowerCase().includes(query) ||
      attendee.id.toLowerCase().includes(query)
    );
  }
  getUserDetails() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.userInfo = JSON.parse(userStr);
    }
  }

  toggleAttendee(attendee: Attendee) {
    console.log(attendee, "Attendee");
    
    attendee.checked = !attendee.checked;
        const checkedStatuses = JSON.parse(localStorage.getItem('checkedAttendees') || '{}');
    checkedStatuses[attendee.id] = attendee.checked;
    localStorage.setItem('checkedAttendees', JSON.stringify(checkedStatuses));
    
    this.openCheckInModal(attendee);
  }
  openCheckInModal(attendee: Attendee) {
    this.selectedAttendee = attendee;
    this.selectedAttendeeName = attendee.fullname;
    this.isModalOpen = true;
  }

  confirmCheckIn() {
    if (this.selectedAttendee) {
      this.selectedAttendee.checked = true;
      
      const checkedStatuses = JSON.parse(localStorage.getItem('checkedAttendees') || '{}');
      checkedStatuses[this.selectedAttendee.id] = true;
      localStorage.setItem('checkedAttendees', JSON.stringify(checkedStatuses));
      const payload = {
        user_id: this.selectedAttendee.id,
        day: this.selectedDay(),
        gender: this.checkInType()
      }

      this.apiService.checkInAttendee(payload).subscribe({
        next: (response: any) => {
          localStorage.removeItem('checkedAttendees')
          this.isModalOpen = false;
          this.selectedAttendeeUser.set({
            // fullName: this.selectedAttendee.fullname,
            ticketType: `${response.day} Day(s) Tickets`,
            ticket: `ID: ${response.id}`,
            // initials: this.getInitials(this.selectedAttendee.fullname)
          });
       console.log(this.selectedAttendeeUser());
       
          this.isSuccessModalOpen = true;
          console.log(response, "any");
        },
        error: (error) => {
          localStorage.removeItem('checkedAttendees')
          console.error('Error fetching users:', error);
        }
      });
    }
    this.closeModal();
  }

  handleCheckInType(data: { type: 'female' | 'male' | 'none' }) {
    this.checkInType.set(data.type);
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
    this.authService.userLogout().subscribe({
      next: (response: any) => {
        localStorage.clear()
        this.router.navigate(['/login'])
      },
      error: (error) => {
        console.log(error, ">>>");
      }
    });
   
  }

  getUserProfiles() {
    localStorage.removeItem('checkedAttendees')
    const checkedStatuses = JSON.parse(localStorage.getItem('checkedAttendees') || '{}');
    this.apiService.getUsers().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (response: any) => {

        const attendeesData = response.items || []; 
                this.attendees = Array.isArray(attendeesData) ? attendeesData.map(attendee => ({
          ...attendee,
          checked: checkedStatuses[attendee.id] || false
        })) : [];
  
        this.filteredAttendees = this.attendees;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }


  handleDayChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedDay.set(value);
  }

  handleCheckIn() {
    const payload = {}
  }

  getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  gotoScanner() {
    this.router.navigate(['/qr-scanner'])
  }
}
