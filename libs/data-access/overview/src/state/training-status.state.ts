import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';

import {
  getToastContentBySeverity,
  ToastSeverity,
} from '@customer-portal/shared';

import { TrainingStatusGraphResponseDto } from '../dtos';
import { TrainingStatusModel } from '../models';
import { TrainingStatusMapper, TrainingStatusService } from '../services';
import {
  LoadTrainingStatus,
  LoadTrainingStatusSuccess,
  RedirectToLms,
} from './actions';

export interface TrainingStatusStateModel {
  trainings: TrainingStatusModel[];
  traningStatusError: boolean;
}

const defaultState: TrainingStatusStateModel = {
  trainings: [],
  traningStatusError: false,
};

@State<TrainingStatusStateModel>({
  name: 'TrainingStatus',
  defaults: defaultState,
})
@Injectable()
export class TrainingStatusState {
  constructor(
    private trainingStatusService: TrainingStatusService,
    private messageService: MessageService,
  ) {}

  @Action(LoadTrainingStatus)
  loadTrainingStatus(ctx: StateContext<TrainingStatusStateModel>) {
    return this.trainingStatusService.getTrainingStatusList().pipe(
      tap((trainingStatusList: TrainingStatusGraphResponseDto) => {
        const trainingStatus =
          TrainingStatusMapper.mapToTrainingStatusList(trainingStatusList);

        if (trainingStatus.isSuccess) {
          ctx.dispatch(new LoadTrainingStatusSuccess(trainingStatus.data));
        } else {
          ctx.patchState({
            traningStatusError: true,
          });
        }
      }),
      catchError(() => {
        ctx.patchState({
          traningStatusError: true,
        });

        return of(null);
      }),
    );
  }

  @Action(LoadTrainingStatusSuccess)
  loadActionsDetailsSuccess(
    ctx: StateContext<TrainingStatusStateModel>,
    { trainingStatusList }: LoadTrainingStatusSuccess,
  ): void {
    ctx.patchState({
      trainings: trainingStatusList,
      traningStatusError: false,
    });
  }

  @Action(RedirectToLms)
  redirectToLms(
    ctx: StateContext<TrainingStatusStateModel>,
    action: RedirectToLms,
  ): void {
    if (action.url) {
      window.open(action.url, '_blank');
    } else {
      this.messageService.add(
        getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
      );
    }
  }
}
