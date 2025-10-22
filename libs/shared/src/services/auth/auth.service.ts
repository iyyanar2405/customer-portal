import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { AuthTokenConstants } from '../../constants/auth-constants';
import { AuthServiceResponse, LoginRequest, LoginResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApiUrl = environment.authApiUrl;
  private isLoggingOut = signal<boolean>(this.getLogoutStateFromStorage());

  constructor(private readonly http: HttpClient) {}

  login(): void {
    this.clearTokenData();
    this.setLogoutState(false);
    window.location.href = `${this.authApiUrl}/login?returnUrl=${encodeURIComponent(environment.baseUrl)}`;
  }

  loginWithCredentials(loginRequest: LoginRequest): Observable<LoginResponse> {
    this.clearTokenData();
    this.setLogoutState(false);
    
    return this.http.post<LoginResponse>('/api/authorize/token', loginRequest, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      withCredentials: false  // Explicitly disable credentials to avoid CORS issues
    });
  }

  logout(): Observable<string> {
    this.clearTokenData();
    this.setLogoutState(true);

    return this.http.post<string>(
      '/api/authorize/Logout',
      {},
      { 
        responseType: 'text' as 'json',
        withCredentials: false
      },
    );
  }

  isLogOutInProgress(): boolean {
    return this.isLoggingOut();
  }

  getToken(): Observable<string> {
    return this.http.get('/api/authorize/token', {
      responseType: 'text',
      withCredentials: false
    });
  }

  getClientCredentialToken(): Observable<string> {
    return this.http.get<string>('/api/authorize/IsAuthenticated', {
      withCredentials: false
    });
  }

  isUserAuthenticatedWithExpiryInfo(): Observable<AuthServiceResponse> {
    if (this.isLoggingOut()) {
      return of({
        isUserAuthenticated: false,
        expiryTimeUtc: new Date(),
      });
    }

    return this.http.get<AuthServiceResponse>('/api/authorize/token', {
      withCredentials: false
    });
  }

  isUserValidated(): Observable<boolean> {
    return this.http.get<boolean>('/api/authorize/IsAuthenticated', {
      withCredentials: false
    });
  }

  resetLogoutState(): void {
    this.setLogoutState(false);
  }

  storeTokenData(expiresAt: string): void {
    localStorage.setItem(AuthTokenConstants.TOKEN_EXPIRY_KEY, expiresAt);
  }

  storeLoginResponse(loginResponse: LoginResponse): void {
    localStorage.setItem('access_token', loginResponse.access_token);
    localStorage.setItem('token_type', loginResponse.token_type);
    localStorage.setItem('refresh_token', loginResponse.refreshToken);
    localStorage.setItem(AuthTokenConstants.TOKEN_EXPIRY_KEY, loginResponse.expires);
    localStorage.setItem('token_issued', loginResponse.issued);
  }

  getStoredAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  clearTokenData(): void {
    localStorage.removeItem(AuthTokenConstants.SHOW_MODAL_KEY);
    localStorage.removeItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(AuthTokenConstants.LAST_ACTIVITY_KEY);
    localStorage.removeItem(AuthTokenConstants.TOKEN_DURATION_KEY);
    localStorage.removeItem(AuthTokenConstants.AUTH_LOGGING_OUT);
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_issued');
  }

  private setLogoutState(value: boolean): void {
    this.isLoggingOut.set(value);
    localStorage.setItem(
      AuthTokenConstants.AUTH_LOGGING_OUT,
      JSON.stringify(value),
    );
  }

  private getLogoutStateFromStorage(): boolean {
    const stored = localStorage.getItem(AuthTokenConstants.AUTH_LOGGING_OUT);

    return stored ? JSON.parse(stored) : false;
  }
}
