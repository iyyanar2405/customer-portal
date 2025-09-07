import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  filter,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { UserTelemetryService } from '@customer-portal/core';
import {
  ProfileLanguageStoreService,
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
  SettingsUserValidationService,
  UserValidation,
} from '@customer-portal/data-access/settings';
import { environment } from '@customer-portal/environments';
import {
  AppPagesEnum,
  appPublicPages,
  AuthService,
  AuthTokenConstants,
  CoBrowsingSharedService,
} from '@customer-portal/shared';

import { UserValidationSubcodes } from '../constants';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  private userTelemetryService = inject(UserTelemetryService);

  constructor(
    public settingsCompanyDetailsStoreService: SettingsCompanyDetailsStoreService,
    private authService: AuthService,
    private settingsUserValidationService: SettingsUserValidationService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private profileLanguageStoreService: ProfileLanguageStoreService,
    private profileStoreService: ProfileStoreService,
    private router: Router,
    private coBrowsingSharedService: CoBrowsingSharedService,
  ) {}

  initializePermissions = () =>
    this.authService.isUserAuthenticatedWithExpiryInfo().pipe(
      tap(() => this.coBrowsingSharedService.setCoBrowsingUserEmail(null)),
      switchMap((auth) => {
        if (!auth.isUserAuthenticated) {
          if (!appPublicPages.includes(window.location.pathname)) {
            return from(this.router.navigateByUrl(AppPagesEnum.Welcome));
          }

          return of({});
        }
        this.updateTokenExpiry(new Date(auth.expiryTimeUtc));

        return this.settingsUserValidationService.getUserValidation().pipe(
          switchMap((result) => {
            if (result.isDnvUser) {
              this.settingsCoBrowsingStoreService.updateIsDnvUser(true);

              return from(
                this.router.navigateByUrl(
                  AppPagesEnum.CoBrowsingCompanySelect,
                  {
                    state: { isUserValidated: true, isDnvUser: true },
                  },
                ),
              );
            }

            this.handleUserValidationActions(result);

            this.profileStoreService.loadProfileData();
            this.profileLanguageStoreService.loadProfileLanguage();
            this.settingsCompanyDetailsStoreService.loadSettingsCompanyDetails();

            const loadUserPermissions =
              this.profileStoreService.profileInformationAccessLevel.pipe(
                filter(
                  (accessLevel) =>
                    accessLevel && !!Object.keys(accessLevel).length,
                ),
                take(1),
              );
            const loadProfileLanguage =
              this.profileLanguageStoreService.profileLanguageLabel.pipe(
                filter((languageLabel) => languageLabel !== null),
                take(1),
              );

            const loadCompanyDetails =
              this.settingsCompanyDetailsStoreService.companyDetailsLoaded$.pipe(
                filter((loaded) => loaded),
                take(1),
              );

            this.profileStoreService.setInitialLoginStatus(false);

            return forkJoin({
              permissions: loadUserPermissions,
              language: loadProfileLanguage,
              companyDetails: loadCompanyDetails,
            }).pipe(
              switchMap(() =>
                this.userTelemetryService.initializeUserTracking(),
              ),
              map(() => true),
              catchError((error) => {
                throw error;
              }),
            );
          }),
        );
      }),
    );

  private handleUserValidationActions = (
    result: UserValidation,
  ): Observable<boolean | object> => {
    const { userIsActive, policySubCode, termsAcceptanceRedirectUrl } = result;

    if (this.hasNoValidSubscription(userIsActive, policySubCode)) {
      return from(
        this.router.navigateByUrl(AppPagesEnum.Welcome, {
          state: { isUserValidated: false },
        }),
      );
    }

    if (
      policySubCode === UserValidationSubcodes.TermsAndConditionsNotAccepted
    ) {
      const termsAcceptanceRedirectUpdatedUrl =
        termsAcceptanceRedirectUrl.replace(
          'redirect-url=',
          `redirect-url=${environment.baseUrl}`,
        );
      window.open(termsAcceptanceRedirectUpdatedUrl, '_self');

      return of({});
    }

    return of({});
  };

  private hasNoValidSubscription(
    userActive: boolean,
    policySubCode: number | null,
  ): boolean {
    return (
      !userActive ||
      policySubCode === UserValidationSubcodes.NoValidSubscription
    );
  }

  private updateTokenExpiry(newExpiryDate: Date): void {
    const existingExpiry = localStorage.getItem(
      AuthTokenConstants.TOKEN_EXPIRY_KEY,
    );

    if (!existingExpiry) {
      this.storeNewExpiry(newExpiryDate);

      return;
    }

    const existingExpiryDate = new Date(existingExpiry);
    this.storeLatestExpiry(existingExpiryDate, newExpiryDate);
  }

  private storeNewExpiry(expiryDate: Date): void {
    this.authService.storeTokenData(expiryDate.toISOString());
  }

  private storeLatestExpiry(existingDate: Date, newDate: Date): void {
    if (newDate > existingDate) {
      this.storeNewExpiry(newDate);
    } else {
      const existingDuration = localStorage.getItem(
        AuthTokenConstants.TOKEN_DURATION_KEY,
      );

      if (existingDuration) {
        localStorage.setItem(
          AuthTokenConstants.TOKEN_DURATION_KEY,
          existingDuration,
        );
      }
    }
  }
}
