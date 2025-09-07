import { Selector } from '@ngxs/store';

import { TrainingStatusModel } from '../../models';
import {
  TrainingStatusState,
  TrainingStatusStateModel,
} from '../training-status.state';

export class TrainingStatusSelectors {
  @Selector([TrainingStatusState])
  static trainingStatusDetails(
    state: TrainingStatusStateModel,
  ): TrainingStatusModel[] {
    return state.trainings;
  }

  @Selector([TrainingStatusState])
  static trainingStatusError(state: TrainingStatusStateModel): boolean {
    return state.traningStatusError;
  }
}
