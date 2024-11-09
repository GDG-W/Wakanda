import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Attendee {
  id: string;
  initials: string;
  fullName: string;
  email: string;
  ticket: string;
  ticketType: string;
  checked: boolean;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  attendee: Attendee;
}

export interface AttendeeResponse {
  data: Attendee[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
    
export class ApiService {
    private readonly API_URL = environment.apiUrl;
    private http = inject(HttpClient)

  getAttendees(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Observable<AttendeeResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<AttendeeResponse>(`${this.API_URL}/attendees`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Check in an attendee
  checkInAttendee(attendeeId: string): Observable<CheckInResponse> {
    return this.http.post<CheckInResponse>(
      `${this.API_URL}/attendees/${attendeeId}/check-in`,
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get check-in statistics
  getCheckInStats(): Observable<any> {
    return this.http.get(`${this.API_URL}/stats/check-in`).pipe(
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.API_URL}users/profile`).pipe(
      catchError(this.handleError)
    );
  }

  // Scan QR code
  scanQRCode(qrData: string): Observable<Attendee> {
    return this.http.post<CheckInResponse>(
      `${this.API_URL}/attendees/scan`,
      { qrData }
    ).pipe(
      map(response => response.attendee),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => ({
      error: error.error?.message || 'An unexpected error occurred',
      status: error.status
    }));
  }
}