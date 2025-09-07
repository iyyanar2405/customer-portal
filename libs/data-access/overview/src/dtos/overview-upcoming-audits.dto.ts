export interface OverviewUpcomingAuditDto {
  isSuccess: boolean;
  data: OverviewUpcomingAuditDataDto[];
}
export interface OverviewUpcomingAuditDataDto {
  confirmed: string[];
  toBeConfirmed: string[];
  toBeConfirmedByDNV: string[];
}
