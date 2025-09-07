export interface CalendarScheduleModel {
  address: string;
  auditType: string;
  city: string;
  company: string;
  endDate: string;
  leadAuditor: string;
  scheduleId: string;
  service: string;
  site: string;
  siteRepresentative: string;
  startDate: string;
  status: string;
}

export interface CalendarScheduleParams {
  month?: number;
  year?: number;
  companies?: number[];
  services?: number[];
  sites?: number[];
  statuses?: number[];
}
