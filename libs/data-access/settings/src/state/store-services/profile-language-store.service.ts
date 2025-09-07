import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import { Language } from '@customer-portal/shared';

import { LoadProfileLanguage, UpdateProfileLanguage } from '../actions';
import { ProfileLanguageSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class ProfileLanguageStoreService {
  constructor(private store: Store) {}

  get languageLabel(): Signal<Language> {
    return this.store.selectSignal(ProfileLanguageSelectors.languageLabel);
  }

  get profileLanguageLabel(): Observable<Language> {
    return this.store.select(ProfileLanguageSelectors.languageLabel);
  }

  @Dispatch()
  loadProfileLanguage = () => new LoadProfileLanguage();

  @Dispatch()
  updateProfileLanguage = (languageLabel: Language) =>
    new UpdateProfileLanguage(languageLabel);
}
