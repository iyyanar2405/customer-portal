import {
  COLUMN_DELIMITER,
  convertToUtcDate,
  CURRENT_DATE_FORMAT,
  FilteringConfig,
  GridFileActionType,
  mapFilterConfigToValues,
  utcDateToPayloadFormat,
} from '@customer-portal/shared';

import {
  AuditDetailsDto,
  AuditDocumentListItemDto,
  AuditDocumentsListDto,
  AuditFindingListDto,
  AuditFindingListItemDto,
  AuditFindingsExcelPayloadDto,
  AuditSiteListItemDto,
  SitesListDto,
  SubAuditExcelPayloadDto,
  SubAuditListDto,
  SubAuditListItemDto,
} from '../../dtos';
import {
  AuditDetailsModel,
  AuditDocumentListItemModel,
  AuditFindingListItemModel,
  AuditSiteListItemModel,
  SubAuditListItemModel,
} from '../../models';

export const STRING_DELIMITER = ', ';

export class AuditDetailsMapperService {
  static mapToAuditFindingListItemModel(
    dto: AuditFindingListDto,
  ): AuditFindingListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((finding: AuditFindingListItemDto) => {
      const cities = Array.from(new Set(finding.cities)).join(COLUMN_DELIMITER);
      const sites = Array.from(new Set(finding.sites)).join(COLUMN_DELIMITER);
      const services = Array.from(new Set(finding.services)).join(
        COLUMN_DELIMITER,
      );

      return {
        findingNumber: String(finding.findingNumber),
        status: finding.status,
        title: finding.title,
        category: finding.category,
        companyName: finding.companyName,
        services,
        site: sites,
        city: cities,
        auditNumber: String(finding.auditId),
        openDate: convertToUtcDate(finding.openDate, CURRENT_DATE_FORMAT),
        dueDate: convertToUtcDate(finding.dueDate, CURRENT_DATE_FORMAT),
        closeDate: convertToUtcDate(finding.closedDate, CURRENT_DATE_FORMAT),
        acceptedDate: convertToUtcDate(
          finding.acceptedDate,
          CURRENT_DATE_FORMAT,
        ),
      };
    });
  }

  static mapToAuditFindingsExcelPayloadDto(
    filterConfig: FilteringConfig,
    auditId: string,
  ): AuditFindingsExcelPayloadDto {
    return {
      filters: {
        findings: mapFilterConfigToValues(filterConfig, 'findingNumber'),
        audit: mapFilterConfigToValues(filterConfig, 'auditNumber'),
        auditId: [Number(auditId)],
        status: mapFilterConfigToValues(filterConfig, 'status'),
        title: mapFilterConfigToValues(filterConfig, 'title'),
        category: mapFilterConfigToValues(filterConfig, 'category'),
        companyName: mapFilterConfigToValues(filterConfig, 'companyName'),
        service: mapFilterConfigToValues(filterConfig, 'service'),
        city: mapFilterConfigToValues(filterConfig, 'city'),
        site: mapFilterConfigToValues(filterConfig, 'site'),
        openDate: mapFilterConfigToValues(
          filterConfig,
          'openDate',
          null,
          utcDateToPayloadFormat,
        ),
        dueDate: mapFilterConfigToValues(
          filterConfig,
          'dueDate',
          null,
          utcDateToPayloadFormat,
        ),
        acceptedDate: mapFilterConfigToValues(
          filterConfig,
          'acceptedDate',
          null,
          utcDateToPayloadFormat,
        ),
        closeDate: mapFilterConfigToValues(
          filterConfig,
          'closeDate',
          null,
          utcDateToPayloadFormat,
        ),
      },
    };
  }

  static mapToSubAuditItemModel(dto: SubAuditListDto): SubAuditListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((audit: SubAuditListItemDto) => {
      const city = Array.from(new Set(audit.cities)).join(COLUMN_DELIMITER);
      const site = Array.from(new Set(audit.sites)).join(COLUMN_DELIMITER);
      const service = Array.from(new Set(audit.services)).join(
        COLUMN_DELIMITER,
      );
      const auditorTeam = Array.from(new Set(audit.auditorTeam)).join(
        COLUMN_DELIMITER,
      );

      return {
        auditNumber: String(audit.auditId),
        status: audit.status,
        service,
        site,
        city,
        startDate: convertToUtcDate(audit.startDate),
        endDate: convertToUtcDate(audit.endDate),
        auditorTeam,
      };
    });
  }

  static mapToSubAuditExcelPayloadDto(
    auditId: number,
    filterConfig: FilteringConfig,
  ): SubAuditExcelPayloadDto {
    return {
      auditId,
      filters: {
        status: mapFilterConfigToValues(filterConfig, 'status', []) as string[],
        service: mapFilterConfigToValues(
          filterConfig,
          'service',
          [],
        ) as string[],
        sites: mapFilterConfigToValues(filterConfig, 'site', []) as string[],
        city: mapFilterConfigToValues(filterConfig, 'city', []) as string[],
        startDate: mapFilterConfigToValues(
          filterConfig,
          'startDate',
          [],
          utcDateToPayloadFormat,
        ) as string[],
        endDate: mapFilterConfigToValues(
          filterConfig,
          'endDate',
          [],
          utcDateToPayloadFormat,
        ) as string[],
        auditorTeam: (
          mapFilterConfigToValues(filterConfig, 'auditorTeam', []) as string[]
        )
          .join()
          .split(STRING_DELIMITER)
          .filter((e) => e),
      },
    };
  }

  static mapToAuditDetailsModel(
    dto: AuditDetailsDto,
    reports: AuditDocumentsListDto,
  ): AuditDetailsModel | null {
    if (!dto?.data) {
      return null;
    }

    const { data } = dto;
    const customerTypeSecurity = '10';
    const { auditPlanDocId, auditReportDocId } = reports?.data?.reduce(
      (acc, item) => {
        if (item.currentSecurity === customerTypeSecurity) {
          if (item.type?.toLowerCase().includes('audit plan')) {
            acc.auditPlanDocId.push(item.documentId);
          } else if (item.type?.toLowerCase().includes('audit report')) {
            acc.auditReportDocId.push(item.documentId);
          }
        }

        return acc;
      },
      {
        auditPlanDocId: [] as number[],
        auditReportDocId: [] as number[],
      },
    ) ?? {
      auditPlanDocId: [],
      auditReportDocId: [],
    };

    const services = data.services
      .map((service) => service)
      .filter(
        (serviceName) => serviceName !== null && serviceName !== undefined,
      )
      .join(STRING_DELIMITER);

    const auditorTeam = data.auditorTeam
      .filter((memberName) => memberName !== null && memberName !== undefined)
      .map((member) => `${member}`);

    const resultModel: AuditDetailsModel = {
      auditNumber: Number(data.auditId),
      header: {
        status: data.status,
        siteName: data.siteName,
        siteAddress: data.siteAddress,
        startDate: convertToUtcDate(data.startDate, CURRENT_DATE_FORMAT),
        endDate: convertToUtcDate(data.endDate, CURRENT_DATE_FORMAT),
        auditor: data.leadAuditor,
        auditorTeam,
        services,
        auditPlanDocId,
        auditReportDocId,
      },
    };

    return resultModel;
  }

  static mapToAuditSitesItemModel(dto: SitesListDto): AuditSiteListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((site: AuditSiteListItemDto) => ({
      siteName: site.siteName,
      siteAddress: site.addressLine,
      city: site.city,
      country: site.country,
      postcode: site.postCode,
    }));
  }

  static mapToAuditDocumentItemModel(
    dto: AuditDocumentsListDto,
    hasAuditsEditPermission: boolean,
    isDnvUser: boolean,
  ): AuditDocumentListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((auditDocument: AuditDocumentListItemDto) => {
      const actions = [
        {
          label: 'download',
          iconClass: 'pi-download',
          actionType: GridFileActionType.Download,
        },
      ];

      const canBeDeleted =
        !isDnvUser && auditDocument.canBeDeleted && hasAuditsEditPermission;

      if (canBeDeleted) {
        actions.push({
          label: 'delete',
          iconClass: 'pi-trash',
          actionType: GridFileActionType.Delete,
        });
      }

      return {
        documentId: auditDocument.documentId,
        fileName: auditDocument.fileName,
        fileType: auditDocument.type,
        dateAdded: convertToUtcDate(
          auditDocument.dateAdded,
          CURRENT_DATE_FORMAT,
        ),
        uploadedBy: auditDocument.uploadedBy,
        actions,
        canBeDeleted: auditDocument.canBeDeleted,
      };
    });
  }
}
