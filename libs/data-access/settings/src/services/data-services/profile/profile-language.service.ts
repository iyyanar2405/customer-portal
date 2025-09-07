import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { Language } from '@customer-portal/shared';

import { ProfileLanguageDto } from '../../../dtos';
import {
  PROFILE_LANGUAGE_MUTATION,
  PROFILE_LANGUAGE_QUERY,
} from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class ProfileLanguageService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getProfileLanguage(): Observable<ProfileLanguageDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: PROFILE_LANGUAGE_QUERY,
        variables: {},
      })
      .pipe(map((results: any) => results?.data?.userProfile));
  }

  updateProfileLanguage(language: Language): Observable<ProfileLanguageDto> {
    return this.apollo
      .use(this.clientName)
      .mutate({
        mutation: PROFILE_LANGUAGE_MUTATION,
        variables: {
          language,
        },
      })
      .pipe(map((results: any) => results?.data?.updateProfile));
  }
}
