export interface FindingListDto {
  data: FindingListItemDto[];
}

export interface FindingListItemDto {
  findingsId: string;
  findingNumber: string;
  status: string;
  title: string;
  category: string;
  companyName: string;
  services: string[];
  sites: string[];
  cities: string[];
  openDate: string;
  closedDate: string;
  acceptedDate: string;
  countries: string[];
}
