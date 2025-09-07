import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { FindingExcelPayloadDto } from '../../dtos';
import { FINDING_LIST_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class FindingsListService {
  private clientName = 'finding';

  private readonly exportFindingExcelUrl = `${environment.documentsApi}/ExportFindings`;

  constructor(
    private readonly apollo: Apollo,
    private http: HttpClient,
  ) {}

  getFindingList() {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDING_LIST_QUERY,
      })
      .pipe(map((results: any) => results.data.viewFindings));
  }

  exportFindingsExcel({
    filters,
  }: FindingExcelPayloadDto): Observable<number[]> {
    return this.http
      .post<{ data: number[] }>(this.exportFindingExcelUrl, { filters })
      .pipe(map((response) => response.data));
  }
}
