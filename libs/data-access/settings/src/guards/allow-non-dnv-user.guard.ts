import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SettingsCoBrowsingStoreService } from '../state';

export const allowNonDnvUserGuard: CanActivateFn = () => {
  const settingsCoBrowsingStoreService = inject(SettingsCoBrowsingStoreService);
  const router = inject(Router);

  return settingsCoBrowsingStoreService.isDnvUser()
    ? router.createUrlTree([''])
    : true;
};
