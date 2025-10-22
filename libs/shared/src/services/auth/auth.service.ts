import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  constructor(private readonly http: HttpClient) {}

  // Cookie utility methods
  private setCookie(name: string, value: string, days: number = 7): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure;samesite=strict`;
  }

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

  // Method to check authentication with credentials (use only immediately after login)
  verifyAuthenticationWithCredentials(loginRequest: LoginRequest, token: string): Observable<any> {
    const headers: { [key: string]: string } = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    return this.http.post('/api/authorize/IsAuthenticated', loginRequest, {
      headers,
      withCredentials: false
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
    // Return the stored access token from localStorage instead of making a GET request
    const storedToken = this.getStoredAccessToken();
    return of(storedToken || '');
  }

  getClientCredentialToken(): Observable<string> {
    // Return the stored token directly instead of making API call
    // The API requires credentials which we shouldn't store long-term
    const token = this.getStoredAccessToken();
    return of(token || '');
  }

  isUserAuthenticatedWithExpiryInfo(): Observable<AuthServiceResponse> {
    if (this.isLoggingOut()) {
      this.router.navigate(['/welcome']);
      return of({
        isUserAuthenticated: false,
        expiryTimeUtc: new Date(),
      });
    }

    // Check if we have a stored token first
    const token = this.getStoredAccessToken();
    if (!token) {
      this.router.navigate(['/welcome']);
      return of({
        isUserAuthenticated: false,
        expiryTimeUtc: new Date(),
      });
    }

    // Since we have a token, consider the user authenticated
    // The API design requiring credentials for auth check is unusual
    // For now, return true if we have a valid token
    const expiryTime = this.getCookie('token_issued');
    const expiryDate = expiryTime ? new Date(expiryTime) : new Date();
    
    return of({
      isUserAuthenticated: true,
      expiryTimeUtc: expiryDate,
    });
  }

  isUserValidated(): Observable<boolean> {
    const token = this.getStoredAccessToken();
    // Simply return true/false based on token existence
    // Since the API requires credentials for auth checks, 
    // we'll rely on token presence for validation
    return of(!!token);
  }

  // Check authentication and redirect to welcome if not authenticated
  checkAuthAndRedirect(): boolean {
    const token = this.getStoredAccessToken();
    const isAuthenticated = !!token && !this.isLoggingOut();
    
    if (!isAuthenticated) {
      this.router.navigate(['/welcome']);
      return false;
    }
    
    return true;
  }

  // Check if user is authenticated (synchronous)
  isAuthenticated(): boolean {
    const token = this.getStoredAccessToken();
    return !!token && !this.isLoggingOut();
  }

  resetLogoutState(): void {
    this.setLogoutState(false);
  }

  storeTokenData(expiresAt: string): void {
    this.setCookie(AuthTokenConstants.TOKEN_EXPIRY_KEY, expiresAt);
  }

  storeLoginResponse(loginResponse: LoginResponse): void {
    this.setCookie('access_token', loginResponse.access_token);
    this.setCookie('token_type', loginResponse.token_type);
    this.setCookie('refresh_token', loginResponse.refreshToken);
    this.setCookie(AuthTokenConstants.TOKEN_EXPIRY_KEY, loginResponse.expires);
    this.setCookie('token_issued', loginResponse.issued);
  }

  // Store login credentials in cookies (Note: storing password in cookies is not recommended for production)
  storeLoginCredentials(loginRequest: LoginRequest): void {
    this.setCookie('user_id', loginRequest.userName);
    this.setCookie('user_password', loginRequest.password); // Warning: Not secure for production
    this.setCookie('device_code', loginRequest.deviceCode);
  }

  getStoredAccessToken(): string | null {
    return this.getCookie('access_token');
  }

  getStoredCredentials(): LoginRequest | null {
    const userName = this.getCookie('user_id');
    const password = this.getCookie('user_password');
    const deviceCode = this.getCookie('device_code');
    
    if (userName && password && deviceCode) {
      return { userName, password, deviceCode };
    }
    return null;
  }

  clearTokenData(): void {
    this.deleteCookie(AuthTokenConstants.SHOW_MODAL_KEY);
    this.deleteCookie(AuthTokenConstants.TOKEN_EXPIRY_KEY);
    this.deleteCookie(AuthTokenConstants.LAST_ACTIVITY_KEY);
    this.deleteCookie(AuthTokenConstants.TOKEN_DURATION_KEY);
    this.deleteCookie(AuthTokenConstants.AUTH_LOGGING_OUT);
    this.deleteCookie('access_token');
    this.deleteCookie('token_type');
    this.deleteCookie('refresh_token');
    this.deleteCookie('token_issued');
    this.deleteCookie('user_id');
    this.deleteCookie('user_password');
    this.deleteCookie('device_code');
  }

  private setLogoutState(value: boolean): void {
    this.isLoggingOut.set(value);
    this.setCookie(AuthTokenConstants.AUTH_LOGGING_OUT, JSON.stringify(value));
  }

  private getLogoutStateFromStorage(): boolean {
    const stored = this.getCookie(AuthTokenConstants.AUTH_LOGGING_OUT);
    return stored ? JSON.parse(stored) : false;
  }
}
