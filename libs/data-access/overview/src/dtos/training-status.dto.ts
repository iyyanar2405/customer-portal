export interface TrainingStatusGraphResponseDto {
  isSuccess: boolean;
  data: TrainingStatusListDto;
}

export interface TrainingStatusListDto {
  trainingData: TrainingStatusDto[];
}

export interface TrainingStatusDto {
  trainingName: string;
  trainingStatus: string;
  trainingDueDate: string;
  trainingLocation: string;
}
