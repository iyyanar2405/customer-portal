import { Route } from '@angular/router';

import { allowNonDnvUserGuard } from '@customer-portal/data-access/settings/guards';
import { RouteConfig } from '@customer-portal/shared/constants';
import { authGuard } from '@customer-portal/shared/guards';

export const appRoutes: Route[] = [
  {
    path: RouteConfig.Welcome.path,
    loadComponent: () =>
      import('./components/welcome/welcome.component').then(
        (m) => m.WelcomeComponent,
      ),
    title: RouteConfig.Welcome.title,
  },
  {
    path: RouteConfig.Logout.path,
    loadComponent: () =>
      import('./components/logout/logout.component').then(
        (m) => m.LogoutComponent,
      ),
    title: RouteConfig.Logout.title,
    canActivate: [allowNonDnvUserGuard],
  },
  {
    path: RouteConfig.Error.path,
    loadComponent: () =>
      import('./components/error/error.component').then(
        (m) => m.ErrorComponent,
      ),
    title: RouteConfig.Error.title,
  },
  {
    path: '',
    loadChildren: () =>
      import('./components/layout/layout.routes').then((r) => r.LAYOUT_ROUTES),
    canMatch: [authGuard],
  },
  {
    path: '**',
    redirectTo: RouteConfig.Error.path,
  },
];
