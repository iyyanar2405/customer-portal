import { BaseApolloResponse } from '@customer-portal/core';

import { AuditListItemDto } from './audit-list-item.dto';

export interface AuditListDto extends BaseApolloResponse {
  data: AuditListItemDto[];
}

export interface AuditListResponseDto {
  data: {
    viewAudits: AuditListDto;
  };
  errors?: [];
}
