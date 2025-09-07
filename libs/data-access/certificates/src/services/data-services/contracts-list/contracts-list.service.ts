import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { ContractsExcelPayloadDto, ContractsListDto } from '../../../dtos';

@Injectable({ providedIn: 'root' })
export class ContractsListService {
  private readonly exportContractExcelUrl = `${environment.documentsApi}/ExportContract`;

  constructor(private readonly httpClient: HttpClient) {}

  getContractsList(): Observable<ContractsListDto> {
    const { documentsApi } = environment;
    const url = `${documentsApi}/ContractList`;

    return this.httpClient.get<ContractsListDto>(url);
  }

  exportContractsExcel({
    filters,
  }: ContractsExcelPayloadDto): Observable<number[]> {
    return this.httpClient
      .post<{ data: number[] }>(this.exportContractExcelUrl, { filters })
      .pipe(map((response) => response.data));
  }
}
