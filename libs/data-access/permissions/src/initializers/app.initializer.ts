import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { AppInitializerService } from '../services';

export const appInitializer = (): Observable<any> => {
  const appInitializerService = inject(AppInitializerService);
  const router = inject(Router);

  return appInitializerService.initializePermissions().pipe(
    tap(() => {
      router.initialNavigation();
    }),
  );
};
