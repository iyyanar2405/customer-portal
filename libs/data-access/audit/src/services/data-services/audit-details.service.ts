import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import {
  AuditFindingsExcelPayloadDto,
  SubAuditExcelPayloadDto,
} from '../../dtos';
import {
  AUDIT_DETAILS_QUERY,
  AUDIT_FINDING_LIST_QUERY,
  AUDIT_SITES_LIST_QUERY,
  EXPORT_AUDIT_FINDINGS_EXCEL_QUERY,
  SUB_AUDIT_LIST_QUERY,
} from '../../graphql';

@Injectable({ providedIn: 'root' })
export class AuditDetailsService {
  private auditClientName = 'audit';
  private findingClientName = 'finding';

  private readonly exportSubAuditExcelUrl = `${environment.documentsApi}/ExportSubAudits`;

  constructor(
    private readonly apollo: Apollo,
    private readonly http: HttpClient,
  ) {}

  getAuditFindingList(auditId: number) {
    return this.apollo
      .use(this.findingClientName)
      .query({
        query: AUDIT_FINDING_LIST_QUERY,
        variables: {
          auditId,
        },
      })
      .pipe(map((results: any) => results.data.viewFindings));
  }

  exportAuditFindingsExcel({ filters }: AuditFindingsExcelPayloadDto) {
    return this.apollo
      .use(this.findingClientName)
      .query({
        query: EXPORT_AUDIT_FINDINGS_EXCEL_QUERY,
        variables: {
          filters,
        },
      })
      .pipe(map((results: any) => results.data.exportFindings.data));
  }

  getSubAuditList(auditId: number) {
    return this.apollo
      .use(this.auditClientName)
      .query({
        query: SUB_AUDIT_LIST_QUERY,
        variables: {
          auditId,
        },
      })
      .pipe(map((results: any) => results.data.viewSubAudits));
  }

  exportSubAuditsExcel(payload: SubAuditExcelPayloadDto): Observable<number[]> {
    const url = `${this.exportSubAuditExcelUrl}?auditId=${payload.auditId}`;

    return this.http
      .post<{ data: number[] }>(url, payload.filters)
      .pipe(map((response) => response.data));
  }

  getAuditDetails(auditId: number) {
    return this.apollo
      .use(this.auditClientName)
      .query({
        query: AUDIT_DETAILS_QUERY,
        variables: {
          auditId,
        },
      })
      .pipe(map((result: any) => result.data.auditDetails));
  }

  getSitesList(auditId: number) {
    return this.apollo
      .use(this.auditClientName)
      .query({
        query: AUDIT_SITES_LIST_QUERY,
        variables: {
          auditId,
        },
      })
      .pipe(map((results: any) => results.data.viewSitesForAudit));
  }
}
