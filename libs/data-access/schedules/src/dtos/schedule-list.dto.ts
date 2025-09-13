export interface ScheduleListDto {
  data: ScheduleListItemDto[];
  isSuccess: boolean;
}

export interface ScheduleListItemDto {
  siteAuditId: number;
  startDate: string;
  endDate: string;
  status: string;
  services: string[];
  site: string;
  city: string;
  auditType: string;
  leadAuditor: string;
  siteRepresentatives: string[];
  company: string;
  siteAddress: string;
  auditID: number;
  siteZip: number;
  siteCountry: string;
  siteState: string;
  reportingCountry: string;
  projectNumber: string;
  accountDNVId: number;  
}
