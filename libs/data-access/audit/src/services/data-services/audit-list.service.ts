import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { BaseApolloService } from '@customer-portal/core';
import { environment } from '@customer-portal/environments';

import { AuditExcelPayloadDto, AuditListDto } from '../../dtos';
import { AUDIT_LIST_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class AuditListService extends BaseApolloService {
  private clientName = 'audit';

  private readonly exportAuditExcelUrl = `${environment.documentsApi}/ExportAudits`;

  constructor(
    apollo: Apollo,
    private http: HttpClient,
  ) {
    super(apollo);
  }

  getAuditList(): Observable<AuditListDto> {
    const fieldName =
      this.getQueryRootFieldName(AUDIT_LIST_QUERY) || 'viewAudits';

    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_LIST_QUERY,
      })
      .pipe(
        map((result: any) => {
          if (
            result === undefined ||
            result?.data === undefined ||
            result?.errors ||
            result.data?.viewAudits?.isSuccess === false
          ) {
            this.evictFromCache(this.clientName, fieldName);
          }

          return result.data?.viewAudits;
        }),
      );
  }

  exportAuditsExcel({ filters }: AuditExcelPayloadDto): Observable<number[]> {
    return this.http
      .post<{ data: number[] }>(this.exportAuditExcelUrl, { filters })
      .pipe(map((response) => response.data));
  }
}
