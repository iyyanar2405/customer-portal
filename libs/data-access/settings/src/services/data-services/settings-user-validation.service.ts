import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { SETTINGS_USER_VALIDATION_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class SettingsUserValidationService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getUserValidation(): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SETTINGS_USER_VALIDATION_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.validateUser?.data));
  }
}
