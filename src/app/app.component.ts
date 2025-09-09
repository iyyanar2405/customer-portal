import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { SessionTimeoutService, SpinnerComponent } from '@customer-portal/core';
import {
  AuthService,
  AuthTokenConstants,
  BreadcrumbService,
  CoBrowsingSharedService,
  CustomConfirmDialogComponent,
  CustomToastComponent,
  RouteConfig,
  ScriptLoaderService,
} from '@customer-portal/shared';

import {
  BreadcrumbComponent,
  FooterComponent,
  NavbarCoBrowsingComponent,
  NavbarComponent,
  SidebarComponent,
  SidebarMobileComponent,
} from './components';

@Component({
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule,
    SpinnerComponent,
    CustomConfirmDialogComponent,
    CustomToastComponent,
    ToastModule,
    BreadcrumbComponent,
    NavbarComponent,
    SidebarComponent,
    SidebarMobileComponent,
    FooterComponent,
    NavbarCoBrowsingComponent,
    CommonModule,
  ],
  providers: [ConfirmationService],
  selector: 'customer-portal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'customer-portal';
  isLoggedIn = false;
  isDnvUser = false;
  breadcrumbVisibility = false;

  constructor(
    public readonly coBrowsingSharedService: CoBrowsingSharedService,
    private readonly scriptLoader: ScriptLoaderService,
    private readonly sessionTimeoutService: SessionTimeoutService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private breadcrumbService: BreadcrumbService,
    private destroyRef: DestroyRef
  ) {
    this.breadcrumbService.breadcrumbVisibility$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((visibility) => {
        this.breadcrumbVisibility = visibility;
      });
  }

  ngOnInit(): void {
    this.setupInitialRouteConfig(this.router.url);
  }

  private setupInitialRouteConfig(url: string): void {
    if (this.isEmptyRoute(url)) {
      this.authService.clearTokenData();
      return;
    }
    this.initializeApp();
  }

  private isEmptyRoute(url: string): boolean {
    return url === '/' || this.isErrorRoute(url);
  }

  private isErrorRoute(url: string): boolean {
    return url.includes(RouteConfig.Error.path);
  }

  private initializeApp(): void {
    this.initializeScripts();
    this.initializeSession();
    this.initializeUserState();
  }

  private initializeScripts(): void {
    this.scriptLoader.loadServiceNowScript();
  }

  private initializeSession(): void {
    const tokenExpiry = this.getTokenExpiry();
    if (!tokenExpiry) return;
    const expiryDate = new Date(tokenExpiry);
    if (this.isValidExpiryDate(expiryDate)) {
      this.activateSession(expiryDate);
    }
  }

  private getTokenExpiry(): string | null {
    return localStorage.getItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
  }

  private isValidExpiryDate(expiryDate: Date): boolean {
    return expiryDate > new Date();
  }

  private activateSession(expiryDate: Date): void {
    this.isLoggedIn = true;
    this.sessionTimeoutService.initialize(expiryDate);
  }

  private initializeUserState(): void {
    this.isDnvUser = !!window.history.state?.isDnvUser;
  }
}