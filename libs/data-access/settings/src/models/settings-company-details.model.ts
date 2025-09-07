export interface SettingsCompanyDetailsModel {
  isUserAdmin: boolean;
  legalEntityList: SettingsCompanyDetailsData[];
  parentCompany: SettingsCompanyDetailsData | null;
}

export interface SettingsCompanyDetailsData {
  accountId: number;
  address: string;
  city: string;
  country: string;
  countryId: number;
  organizationName: string;
  poNumberRequired: boolean;
  vatNumber: string;
  zipcode: string;
  updatePending: boolean;
}

export interface SettingsCompanyDetailsEditParams {
  accountId: number;
  address: string;
  city: string;
  countryId: number;
  organizationName: string;
  poNumberRequired: boolean;
  vatNumber: string;
  zipCode: string;
}

export interface SettingsCompanyDetailsCountryListData {
  label: string;
  value: number;
}

export interface SettingsCompanyDetailsCountryListModel {
  countryList: SettingsCompanyDetailsCountryListData[];
  countryActiveId: number | null;
}
