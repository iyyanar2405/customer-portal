export interface AuditListItemDto {
  type: string;
  startDate?: string;
  endDate?: string;
  leadAuditor: string;
  auditId: number;
  status: string;
  companyName: string;
  sites: string[];
  services: string[];
  cities: string[];
  countries: string[];
}
