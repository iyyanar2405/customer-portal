import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { PROFILE_QUERY, PROFILE_SETTINGS_MUTATION } from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getProfileData(): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: PROFILE_QUERY,
        variables: {},
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.userProfile));
  }

  updateProfileSettingsData(
    communicationLanguage: string,
    jobTitle: string,
  ): Observable<any> {
    return this.apollo.use(this.clientName).mutate({
      mutation: PROFILE_SETTINGS_MUTATION,
      variables: {
        communicationLanguage,
        jobTitle,
      },
    });
  }
}
