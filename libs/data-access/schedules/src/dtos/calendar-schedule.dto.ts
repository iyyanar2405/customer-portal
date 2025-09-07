export interface CalendarScheduleDto {
  data: CalendarScheduleDataDto[];
  isSuccess: boolean;
}

export interface CalendarScheduleDataDto {
  auditType: string;
  city: string;
  company: string;
  endDate: string;
  leadAuditor: string;
  services: string[];
  site: string;
  siteAddress: string;
  siteAuditId: string;
  siteRepresentatives: string[];
  startDate: string;
  status: string;
}
