import { Route } from '@angular/router';

import { pagePermissionGuard } from '@customer-portal/permissions';
import { RouteConfig } from '@customer-portal/shared/constants';

import { LayoutComponent } from './layout.component';

export const LAYOUT_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: RouteConfig.Overview.path,
      },
      {
        path: RouteConfig.Overview.path,
        loadChildren: () =>
          import('@customer-portal/features/overview').then(
            (r) => r.OVERVIEW_ROUTES,
          ),
        title: RouteConfig.Overview.title,
      },
      {
        path: RouteConfig.ExternalApps.path,
        loadChildren: () =>
          import('@customer-portal/features/external-apps').then(
            (r) => r.EXTERNAL_APPS_ROUTES,
          ),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.ExternalApps.i18nKey,
          },
        },
        title: RouteConfig.ExternalApps.title,
      },
      {
        path: RouteConfig.Audits.path,
        loadChildren: () =>
          import('@customer-portal/features/audit').then((r) => r.AUDIT_ROUTES),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.Audits.i18nKey,
          },
          pageViewRequest: RouteConfig.Audits.pageViewRequest,
        },
        title: RouteConfig.Audits.title,
        canActivate: [pagePermissionGuard],
      },
      {
        path: RouteConfig.Certificates.path,
        loadChildren: () =>
          import('@customer-portal/features/certificates').then(
            (r) => r.CERTIFICATES_ROUTES,
          ),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.Certificates.i18nKey,
          },
          pageViewRequest: RouteConfig.Certificates.pageViewRequest,
        },
        title: RouteConfig.Certificates.title,
        canActivate: [pagePermissionGuard],
      },
      {
        path: RouteConfig.Contracts.path,
        loadChildren: () =>
          import('@customer-portal/features/contracts').then(
            (r) => r.CONTRACTS_ROUTES,
          ),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.Contracts.i18nKey,
          },
          pageViewRequest: RouteConfig.Contracts.pageViewRequest,
        },
        title: RouteConfig.Contracts.title,
        canActivate: [pagePermissionGuard],
      },
      {
        path: RouteConfig.Financials.path,
        loadChildren: () =>
          import('@customer-portal/features/financials').then(
            (r) => r.FINANCIALS_ROUTES,
          ),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.Financials.i18nKey,
          },
          pageViewRequest: RouteConfig.Financials.pageViewRequest,
        },
        title: RouteConfig.Financials.title,
        canActivate: [pagePermissionGuard],
      },
      {
        path: RouteConfig.Findings.path,
        loadChildren: () =>
          import('@customer-portal/features/findings').then(
            (r) => r.FINDINGS_ROUTES,
          ),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.Findings.i18nKey,
          },
          pageViewRequest: RouteConfig.Findings.pageViewRequest,
        },
        title: RouteConfig.Findings.title,
        canActivate: [pagePermissionGuard],
      },
      {
        path: RouteConfig.Schedule.path,
        loadChildren: () =>
          import('@customer-portal/features/schedules').then(
            (r) => r.SCHEDULES_ROUTES,
          ),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.Schedule.i18nKey,
          },
          pageViewRequest: RouteConfig.Schedule.pageViewRequest,
        },
        title: RouteConfig.Schedule.title,
        canActivate: [pagePermissionGuard],
      },
      {
        path: RouteConfig.Actions.path,
        loadChildren: () =>
          import('@customer-portal/features/actions').then(
            (r) => r.ACTIONS_ROUTES,
          ),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.Actions.i18nKey,
          },
        },
        title: RouteConfig.Actions.title,
      },
      {
        path: RouteConfig.Notifications.path,
        loadChildren: () =>
          import('@customer-portal/features/notifications').then(
            (r) => r.NOTIFICATIONS_ROUTES,
          ),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.Notifications.i18nKey,
          },
        },
        title: RouteConfig.Notifications.title,
      },
      {
        path: RouteConfig.Settings.path,
        loadChildren: () =>
          import('@customer-portal/features/settings').then(
            (r) => r.SETTINGS_ROUTES,
          ),
        data: {
          breadcrumb: {
            i18nKey: RouteConfig.Settings.i18nKey,
          },
        },
        title: RouteConfig.Settings.title,
      },
    ],
  },
];
