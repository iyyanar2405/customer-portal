import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { BaseApolloService } from '@customer-portal/core';

import { PreferenceDto } from '../dtos';
import { GET_PREFERENCE_QUERY, SAVE_PREFERENCES_MUTATION } from '../graphql';

@Injectable({
  providedIn: 'root',
})
export class PreferenceService extends BaseApolloService {
  private clientName = 'contact';

  savePreferences(preferenceRequest: PreferenceDto) {
    return this.apollo.use(this.clientName).mutate({
      mutation: SAVE_PREFERENCES_MUTATION,
      variables: {
        preferenceRequest,
      },
    });
  }

  getPreference(objectType: string, objectName: string, pageName: string) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: GET_PREFERENCE_QUERY,
        variables: {
          objectType,
          objectName,
          pageName,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result: any) => result.data?.preferences));
  }
}
