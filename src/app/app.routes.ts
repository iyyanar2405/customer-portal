import { Route } from '@angular/router';
import { allowNonDnvUserGuard } from '@customer-portal/data-access/settings';
import { pagePermissionGuard } from '@customer-portal/permissions';
import { authGuard, RouteConfig } from '@customer-portal/shared';
import { ErrorComponent } from './components/error';
import { LogoutComponent, WelcomeComponent } from './components';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `/${RouteConfig.Overview.path}`,
  },
  {
    path: RouteConfig.Overview.path,
    loadChildren: () =>
      import('@customer-portal/features/overview').then(
        (r) => r.OVERVIEW_ROUTES
      ),
    title: RouteConfig.Overview.title,
    canActivate: [authGuard],
  },
  {
    path: RouteConfig.ExternalApps.path,
    loadChildren: () =>
      import('@customer-portal/features/external-apps').then(
        (r) => r.EXTERNAL_APPS_ROUTES
      ),
    data: {
      breadcrumb: {
        il8nKey: RouteConfig.ExternalApps.il8nKey,
      },
      title: RouteConfig.ExternalApps.title,
    },
    canActivate: [authGuard],
  },
  {
    path: RouteConfig.Audits.path,
    loadChildren: () =>
      import('@customer-portal/features/audit').then((r) => r.AUDIT_ROUTES),
    data: {
      breadcrumb: {
        il8nKey: RouteConfig.Audits.il8nKey,
      },
      pageViewRequest: RouteConfig.Audits.pageViewRequest,
    },
    title: RouteConfig.Audits.title,
    canActivate: [authGuard, pagePermissionGuard],
  },
  {
    path: RouteConfig.Certificates.path,
    loadChildren: () =>
      import('@customer-portal/features/certificates').then(
        (r) => r.CERTIFICATES_ROUTES
      ),
    data: {
      breadcrumb: {
        il8nKey: RouteConfig.Certificates.il8nKey,
      },
      pageViewRequest: RouteConfig.Certificates.pageViewRequest,
    },
    title: RouteConfig.Certificates.title,
    canActivate: [authGuard, pagePermissionGuard],
  },
  {
    path: RouteConfig.Contracts.path,
    loadChildren: () =>
      import('@customer-portal/features/contracts').then(
        (r) => r.CONTRACTS_ROUTES
      ),
    data: {
      breadcrumb: {
        il8nKey: RouteConfig.Contracts.il8nKey,
      },
      pageViewRequest: RouteConfig.Contracts.pageViewRequest,
    },
    title: RouteConfig.Contracts.title,
    canActivate: [authGuard, pagePermissionGuard],
  },
  {
    path: RouteConfig.Financials.path,
    loadChildren: () =>
      import('@customer-portal/features/financials').then(
        (r) => r.FINANCIALS_ROUTES
      ),
    data: {
      breadcrumb: {
        i18nKey: RouteConfig.Financials.i18nKey,
      },
      pageViewRequest: RouteConfig.Financials.pageViewRequest,
    },
    title: RouteConfig.Financials.title,
    canActivate: [authGuard, pagePermissionGuard],
  },
  {
    path: RouteConfig.Findings.path,
    loadChildren: () =>
      import('@customer-portal/features/findings').then(
        (r) => r.FINDINGS_ROUTES
      ),
    data: {
      breadcrumb: {
        il8nKey: RouteConfig.Findings.il8nKey,
      },
      pageViewRequest: RouteConfig.Findings.pageViewRequest,
    },
    title: RouteConfig.Findings.title,
    canActivate: [authGuard, pagePermissionGuard],
  },
  {
    path: RouteConfig.Schedule.path,
    loadChildren: () =>
      import('@customer-portal/features/schedules').then(
        (r) => r.SCHEDULES_ROUTES
      ),
    data: {
      breadcrumb: {
        il8nKey: RouteConfig.Schedule.il8nKey,
      },
      pageViewRequest: RouteConfig.Schedule.pageViewRequest,
    },
    title: RouteConfig.Schedule.title,
    canActivate: [authGuard, pagePermissionGuard],
  },
  {
    path: RouteConfig.Actions.path,
    loadChildren: () =>
      import('@customer-portal/features/actions').then((r) => r.ACTIONS_ROUTES),
    data: {
      breadcrumb: {
        il8nKey: RouteConfig.Actions.il8nKey,
      },
      title: RouteConfig.Actions.title,
    },
    canActivate: [authGuard],
  },
  {
    path: RouteConfig.Notifications.path,
    loadChildren: () =>
      import('@customer-portal/features/notifications').then(
        (r) => r.NOTIFICATIONS_ROUTES
      ),
    data: {
      breadcrumb: {
        il8nKey: RouteConfig.Notifications.il8nKey,
      },
      title: RouteConfig.Notifications.title,
    },
    canActivate: [authGuard],
  },
  {
    path: RouteConfig.Settings.path,
    loadChildren: () =>
      import('@customer-portal/features/settings').then(
        (r) => r.SETTINGS_ROUTES
      ),
    data: {
      breadcrumb: {
        il8nKey: RouteConfig.Settings.il8nKey,
      },
    },
    title: RouteConfig.Settings.title,
    canActivate: [authGuard],
  },
  {
    path: RouteConfig.Welcome.path,
    component: WelcomeComponent,
    title: RouteConfig.Welcome.title,
  },
  {
    path: RouteConfig.Logout.path,
    component: LogoutComponent,
    title: RouteConfig.Logout.title,
    canActivate: [allowNonDnvUserGuard],
  },
  {
    path: RouteConfig.Error.path,
    component: ErrorComponent,
    title: RouteConfig.Error.title,
  },
];