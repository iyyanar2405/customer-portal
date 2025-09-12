import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { AuthTokenConstants } from '../../constants/auth-constants';
import { AuthServiceResponse } from '../../models';

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
    return this.http.get(`${this.authApiUrl}/GetAccessToken`, {
      responseType: 'text',
      withCredentials: true,
    });
  }

  getClientCredentialToken(): Observable<string> {
    return this.http.get<string>(`${this.authApiUrl}/Status`);
  }

  isUserAuthenticatedWithExpiryInfo(): Observable<AuthServiceResponse> {
    if (this.isLoggingOut()) {
      return of({
        isUserAuthenticated: false,
        expiryTimeUtc: new Date(),
      });
    }

    return this.http.get<AuthServiceResponse>(
      `${this.authApiUrl}/UserAuthenticatedwithExpiry`,
      {
        withCredentials: true,
      },
    );
  }

  isUserValidated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.authApiUrl}/ValidateUser`);
  }

  resetLogoutState(): void {
    this.setLogoutState(false);
  }

  storeTokenData(expiresAt: string): void {
    localStorage.setItem(AuthTokenConstants.TOKEN_EXPIRY_KEY, expiresAt);
  }

  clearTokenData(): void {
    localStorage.removeItem(AuthTokenConstants.SHOW_MODAL_KEY);
    localStorage.removeItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(AuthTokenConstants.LAST_ACTIVITY_KEY);
    localStorage.removeItem(AuthTokenConstants.TOKEN_DURATION_KEY);
    localStorage.removeItem(AuthTokenConstants.AUTH_LOGGING_OUT);
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
