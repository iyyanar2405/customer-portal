import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  SettingsCompanyDetailsCountryListDto,
  SettingsCompanyDetailsDto,
} from '../../dtos';
import {
  SETTINGS_COMPANY_DETAILS_COUNTRY_LIST_QUERY,
  SETTINGS_COMPANY_DETAILS_MUTATION,
  SETTINGS_COMPANY_DETAILS_QUERY,
} from '../../graphql';
import { SettingsCompanyDetailsEditParams } from '../../models';

@Injectable({ providedIn: 'root' })
export class SettingsCompanyDetailsService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getSettingsCompanyDetails(): Observable<SettingsCompanyDetailsDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SETTINGS_COMPANY_DETAILS_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.userCompanyDetails));
  }

  getSettingsCompanyDetailsCountryList(): Observable<SettingsCompanyDetailsCountryListDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SETTINGS_COMPANY_DETAILS_COUNTRY_LIST_QUERY,
      })
      .pipe(map((results: any) => results?.data?.getCountries));
  }

  editSettingsCompanyDetails(params: SettingsCompanyDetailsEditParams) {
    return this.apollo.use(this.clientName).mutate({
      mutation: SETTINGS_COMPANY_DETAILS_MUTATION,
      variables: {
        updateCompanyRequest: {
          email: 'archana.shantageri@dnv.com', // TODO placeholder until API makes changes
          ...params,
        },
      },
    });
  }
}
