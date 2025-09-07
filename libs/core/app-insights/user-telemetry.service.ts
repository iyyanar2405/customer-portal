import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProfileStoreService } from '@customer-portal/data-access';
import { RouteStoreService } from '@customer-portal/router';
import { 
  createRouteTitleMap, 
  getRouteDataByPath, 
  RouteConfig 
} from '@customer-portal/shared';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class UserTelemetryService {
  private loggingService = inject(LoggingService);
  private profileStoreService = inject(ProfileStoreService);
  private routerStoreService = inject(RouteStoreService);
  
  private routeTitleMap = createRouteTitleMap();

  initializeUserTracking(): Observable<boolean> {
    try {
      const profile = this.profileStoreService.profileInformation();
      const routeData = this.routerStoreService.routeData();

      if (profile?.email && profile?.veracityId) {
        this.loggingService.setUserContext(profile.email, profile.veracityId);
        
        const currentUrl = window.location.href;
        const pathSegment = window.location.pathname.substring(1);
        const path = pathSegment === '' ? RouteConfig.Overview.path : pathSegment;

        const pageTitle = 
          routeData?.title ||
          this.routeTitleMap(path) ||
          document.title ||
          (path 
            ? path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
            : 'Home');

        const routeDataByPath = getRouteDataByPath(path);
        const pageViewProperties = routeDataByPath
          ? { 
              pageViewRequest: routeDataByPath.pageViewRequest,
              ilSmKey: routeDataByPath.ilSmKey 
            }
          : undefined;

        this.loggingService.logPageView(
          pageTitle,
          currentUrl,
          pageViewProperties
        );
        return of(true);
      }

      this.loggingService.logException(
        new Error('Profile email not available for telemetry')
      );
      return of(false);
    } catch (error) {
      this.loggingService.logException(
        error instanceof Error
          ? error
          : new Error('Error initializing user tracking')
      );
      return of(false);
    }
  }
}