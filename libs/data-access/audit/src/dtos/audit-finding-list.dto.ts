export interface AuditFindingListDto {
  data: AuditFindingListItemDto[];
}

export interface AuditFindingListItemDto {
  acceptedDate: string;
  auditId: string;
  category: string;
  cities: string[];
  closedDate: string;
  companyName: string;
  dueDate: string;
  findingNumber: string;
  findingsId: string;
  openDate: string;
  services: string[];
  sites: string[];
  status: string;
  title: string;
}
