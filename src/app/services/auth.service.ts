// services/auth.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AuthResponse {
  id: string,
  fullname:  string,
  email_address: string,
  created_at: string,
  role: string,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly ACCESS_TOKEN_KEY = 'access_token';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private http = inject(HttpClient)


  login(credentials: { email_address: string; id: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}volunteers/sessions`, credentials).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }


  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.token);
    this.isAuthenticatedSubject.next(true);
  }

  private hasValidToken(): boolean {
    return !!this.getAccessToken();
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
}