export interface ConfirmScheduleModel {
  scheduleId: number;
  startDate: string;
  endDate: string;
  site: string;
  auditType: string;
  auditor: string;
  address: string;
  services: string[];
}
