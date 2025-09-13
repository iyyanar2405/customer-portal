import {
  BaseApolloResponse,
  ServiceDetailsMaster,
} from '@customer-portal/shared';

export interface ServiceMasterListModel
  extends BaseApolloResponse<ServiceMasterListItemModel[]> {
  data: ServiceDetailsMaster[];
}

export interface ServiceMasterListItemModel {
  id: number;
  serviceName: number;
}
