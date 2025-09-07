import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import { PreferenceModel } from '../models';
import { PreferenceMapperService, PreferenceService } from '../services';
import {
  LoadPreference,
  LoadPreferenceSuccess,
  SavePreference,
} from './preference.actions';

export interface PreferenceStateModel {
  preferenceItems: PreferenceModel[];
}

const defaultState: PreferenceStateModel = {
  preferenceItems: [],
};

@State<PreferenceStateModel>({
  name: 'preferences',
  defaults: defaultState,
})
@Injectable()
export class PreferenceState {
  constructor(private preferenceService: PreferenceService) {}

  @Action(LoadPreference)
  loadPreference(
    ctx: StateContext<PreferenceStateModel>,
    { objectName, objectType, pageName }: LoadPreference,
  ) {
    return this.preferenceService
      .getPreference(objectType, objectName, pageName)
      .pipe(
        tap((result) => {
          const preference =
            PreferenceMapperService.mapToPreferenceModel(result);

          ctx.dispatch(new LoadPreferenceSuccess(preference));
        }),
      );
  }

  @Action(LoadPreferenceSuccess)
  loadPreferenceSuccess(
    ctx: StateContext<PreferenceStateModel>,
    { preference }: LoadPreferenceSuccess,
  ) {
    if (!preference) {
      return;
    }

    const state = ctx.getState();
    const preferenceItems = state.preferenceItems
      .filter(
        (item) =>
          item.pageName !== preference.pageName ||
          item.objectType !== preference.objectType ||
          item.objectName !== preference.objectName,
      )
      .concat(preference);

    ctx.patchState({
      preferenceItems,
    });
  }

  @Action(SavePreference)
  savePreference(
    ctx: StateContext<PreferenceStateModel>,
    { preference }: SavePreference,
  ) {
    const dto = PreferenceMapperService.mapToPreferenceDto(preference);

    return this.preferenceService.savePreferences(dto);
  }
}
