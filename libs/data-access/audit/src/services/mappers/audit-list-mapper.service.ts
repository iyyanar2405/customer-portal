import {
  COLUMN_DELIMITER,
  convertToUtcDate,
  FilteringConfig,
  mapFilterConfigToValues,
  utcDateToPayloadFormat,
} from '@customer-portal/shared';

import {
  AuditExcelPayloadDto,
  AuditListDto,
  AuditListItemDto,
} from '../../dtos';
import { AuditListItemModel } from '../../models';

export class AuditListMapperService {
  static mapToAuditItemModel(dto: AuditListDto): AuditListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((audit: AuditListItemDto) => {
      const services = Array.from(new Set(audit.services)).join(
        COLUMN_DELIMITER,
      );

      const sites = Array.from(new Set(audit.sites)).join(COLUMN_DELIMITER);
      const countries = Array.from(new Set(audit.countries)).join(
        COLUMN_DELIMITER,
      );
      const cities = Array.from(new Set(audit.cities)).join(COLUMN_DELIMITER);

      return {
        auditNumber: String(audit.auditId),
        startDate: convertToUtcDate(audit.startDate),
        endDate: convertToUtcDate(audit.endDate),
        city: cities,
        country: countries,
        service: services,
        companyName: audit.companyName,
        site: sites,
        leadAuthor: audit.leadAuditor,
        status: audit.status,
        type: audit.type,
      };
    });
  }

  static mapToAuditExcelPayloadDto(
    filterConfig: FilteringConfig,
  ): AuditExcelPayloadDto {
    return {
      filters: {
        auditId: mapFilterConfigToValues(
          filterConfig,
          'auditNumber',
          null,
          (value: string) => Number(value),
        ),
        city: mapFilterConfigToValues(filterConfig, 'city'),
        country: mapFilterConfigToValues(filterConfig, 'country'),
        service: mapFilterConfigToValues(filterConfig, 'service'),
        leadAuditor: mapFilterConfigToValues(filterConfig, 'leadAuthor'),
        site: mapFilterConfigToValues(filterConfig, 'site'),
        type: mapFilterConfigToValues(filterConfig, 'type'),
        status: mapFilterConfigToValues(filterConfig, 'status'),
        companyName: mapFilterConfigToValues(filterConfig, 'companyName'),
        startDate: mapFilterConfigToValues(
          filterConfig,
          'startDate',
          null,
          utcDateToPayloadFormat,
        ),
        endDate: mapFilterConfigToValues(
          filterConfig,
          'endDate',
          null,
          utcDateToPayloadFormat,
        ),
      },
    };
  }
}
