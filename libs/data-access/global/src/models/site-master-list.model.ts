import { BaseApolloResponse } from "../../../../shared/src";


export interface SiteMasterListModel
  extends BaseApolloResponse<SiteMasterListItemModel[]> {
  data: SiteMasterListItemModel[];
}

export interface SiteMasterListItemModel {
  id: number;
  siteName: string;
  companyId: number;
  companyName: string;
  city: string;
  countryId: number;
  countryName: string;
  formattedAddress: string;
  siteState: string;
  siteZip: string;
}
