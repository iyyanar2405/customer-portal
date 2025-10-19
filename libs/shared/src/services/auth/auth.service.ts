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
        'Accept': 'text/plain',
        'Content-Type': 'application/json'
      }
    });
  }

  logout(): Observable<string> {
    this.clearTokenData();
    this.setLogoutState(true);

    return this.http.post<string>(
      `${this.authApiUrl}/Logout`,
      {},
      { responseType: 'text' as 'json', withCredentials: true },
    );
  }

  isLogOutInProgress(): boolean {
    return this.isLoggingOut();
  }

  getToken(): Observable<string> {
    return this.http.get(`${this.authApiUrl}/token`, {
      responseType: 'text',
      withCredentials: true,
    });
  }

  getClientCredentialToken(): Observable<string> {
    return this.http.get<string>(`${this.authApiUrl}/IsAuthenticated`);
  }

  isUserAuthenticatedWithExpiryInfo(): Observable<AuthServiceResponse> {
    if (this.isLoggingOut()) {
      return of({
        isUserAuthenticated: false,
        expiryTimeUtc: new Date(),
      });
    }

    return this.http.get<AuthServiceResponse>(
      `${this.authApiUrl}/token`,
      {
        withCredentials: true,
      },
    );
  }

  isUserValidated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.authApiUrl}/IsAuthenticated`);
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
