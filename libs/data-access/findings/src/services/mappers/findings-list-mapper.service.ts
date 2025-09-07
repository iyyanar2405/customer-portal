import {
  COLUMN_DELIMITER,
  convertToUtcDate,
  FilteringConfig,
  mapFilterConfigToValues,
  utcDateToPayloadFormat,
} from '@customer-portal/shared';

import {
  FindingExcelPayloadDto,
  FindingListDto,
  FindingListItemDto,
} from '../../dtos';
import { FindingListItemModel } from '../../models';

export class FindingsListMapperService {
  static mapToFindingItemModel(dto: FindingListDto): FindingListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((finding: FindingListItemDto) => {
      const services = Array.from(new Set(finding.services)).join(
        COLUMN_DELIMITER,
      );

      const sites = Array.from(new Set(finding.sites)).join(COLUMN_DELIMITER);
      const countries = Array.from(new Set(finding.countries)).join(
        COLUMN_DELIMITER,
      );
      const cities = Array.from(new Set(finding.cities)).join(COLUMN_DELIMITER);

      return {
        findingNumber: finding.findingNumber,
        status: finding.status,
        title: finding.title,
        category: finding.category,
        companyName: finding.companyName,
        services,
        site: sites,
        city: cities,
        findingsId: String(finding.findingsId),
        openDate: convertToUtcDate(finding.openDate),
        closeDate: convertToUtcDate(finding.closedDate),
        acceptedDate: convertToUtcDate(finding.acceptedDate),
        country: countries,
      };
    });
  }

  static mapToFindingExcelPayloadDto(
    filterConfig: FilteringConfig,
  ): FindingExcelPayloadDto {
    return {
      filters: {
        findings: mapFilterConfigToValues(filterConfig, 'findingNumber'),
        findingsId: mapFilterConfigToValues(filterConfig, 'findingsId'),
        status: mapFilterConfigToValues(filterConfig, 'status'),
        title: mapFilterConfigToValues(filterConfig, 'title'),
        category: mapFilterConfigToValues(filterConfig, 'category'),
        companyName: mapFilterConfigToValues(filterConfig, 'companyName'),
        service: mapFilterConfigToValues(filterConfig, 'services'),
        site: mapFilterConfigToValues(filterConfig, 'site'),
        country: mapFilterConfigToValues(filterConfig, 'country'),
        city: mapFilterConfigToValues(filterConfig, 'city'),
        auditId: mapFilterConfigToValues(filterConfig, 'auditNumber'),
        openDate: mapFilterConfigToValues(
          filterConfig,
          'openDate',
          null,
          utcDateToPayloadFormat,
        ),
        closedDate: mapFilterConfigToValues(
          filterConfig,
          'closeDate',
          null,
          utcDateToPayloadFormat,
        ),
        acceptedDate: mapFilterConfigToValues(
          filterConfig,
          'acceptedDate',
          null,
          utcDateToPayloadFormat,
        ),
      },
    };
  }
}
