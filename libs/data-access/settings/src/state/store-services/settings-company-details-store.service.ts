import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  AdminPermissionChecker,
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared';

import {
  SettingsCompanyDetailsCountryListData,
  SettingsCompanyDetailsData,
  SettingsCompanyDetailsEditParams,
} from '../../models';
import {
  LoadSettingsCompanyDetails,
  LoadSettingsCompanyDetailsCountryList,
  ResetSettingsCompanyDetailsState,
  UpdateEditCompanyDetailsFormValidity,
  UpdateSettingsCompanyDetails,
  UpdateSettingsCompanyDetailsEntityListFilterOptions,
  UpdateSettingsCompanyDetailsEntityListGridConfig,
} from '../actions';
import { SettingsSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class SettingsCompanyDetailsStoreService
  implements AdminPermissionChecker
{
  constructor(private store: Store) {}

  get isUserAdmin(): Signal<boolean> {
    return this.store.selectSignal(SettingsSelectors.isUserAdmin);
  }

  get companyDetailsLoaded(): Signal<boolean> {
    return this.store.selectSignal(SettingsSelectors.companyDetailsLoaded);
  }

  get companyDetailsLoaded$(): Observable<boolean> {
    return this.store.select(SettingsSelectors.companyDetailsLoaded);
  }

  get updatePendingParentCompany(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsSelectors.updatePendingParentCompany,
    );
  }

  get legalEntityList(): Signal<SettingsCompanyDetailsData[]> {
    return this.store.selectSignal(SettingsSelectors.legalEntityList);
  }

  get totalLegalEntityList(): Signal<number> {
    return this.store.selectSignal(SettingsSelectors.totalLegalEntityList);
  }

  get parentCompany(): Signal<SettingsCompanyDetailsData | null> {
    return this.store.selectSignal(SettingsSelectors.parentCompany);
  }

  get legalEntityFilterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(SettingsSelectors.legalEntityFilterOptions);
  }

  get legalEntityFilteringConfig(): Observable<FilteringConfig> {
    return this.store.select(SettingsSelectors.legalEntityFilteringConfig);
  }

  get hasLegalEntityActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsSelectors.hasLegalEntityActiveFilters,
    );
  }

  get legalEntityListCounter(): Signal<number> {
    return this.store.selectSignal(SettingsSelectors.legalEntityListCounter);
  }

  get countryList(): Signal<SettingsCompanyDetailsCountryListData[]> {
    return this.store.selectSignal(SettingsSelectors.countryList);
  }

  get countryActiveId(): Signal<number | null> {
    return this.store.selectSignal(SettingsSelectors.countryActiveId);
  }

  get isEditCompanyDetailsFormValid(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsSelectors.isEditCompanyDetailsFormValid,
    );
  }

  @Dispatch()
  loadSettingsCompanyDetails = () => new LoadSettingsCompanyDetails();

  @Dispatch()
  loadSettingsCompanyDetailsCountryList = () =>
    new LoadSettingsCompanyDetailsCountryList();

  @Dispatch()
  updateSettingsCompanyDetails = (params: SettingsCompanyDetailsEditParams) =>
    new UpdateSettingsCompanyDetails(params);

  @Dispatch()
  updateSettingsCompanyDetailsEntityListFilterOptions = () =>
    new UpdateSettingsCompanyDetailsEntityListFilterOptions();

  @Dispatch()
  updateSettingsCompanyDetailsEntityListGridConfig = (gridConfig: GridConfig) =>
    new UpdateSettingsCompanyDetailsEntityListGridConfig(gridConfig);

  @Dispatch()
  resetSettingsCompanyDetailsState = () =>
    new ResetSettingsCompanyDetailsState();

  @Dispatch()
  updateEditCompanyDetailsFormValidity = (isValid: boolean) =>
    new UpdateEditCompanyDetailsFormValidity(isValid);
}
