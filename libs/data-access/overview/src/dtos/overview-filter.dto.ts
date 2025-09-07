export interface OverviewFilterDto {
  data: OverviewFilterDataDto[];
  isSuccess: boolean;
}

export interface OverviewFilterDataDto {
  children?: OverviewFilterDataDto[];
  id: number;
  label: string;
}
