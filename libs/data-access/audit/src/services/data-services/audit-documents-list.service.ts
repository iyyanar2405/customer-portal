import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { AuditDocumentsListDto } from '../../dtos';

@Injectable({ providedIn: 'root' })
export class AuditDocumentsListService {
  constructor(private readonly httpClient: HttpClient) {}

  getAuditDocumentsList(
    auditId: string,
    planAndReport: boolean,
  ): Observable<AuditDocumentsListDto> {
    const { documentsApi } = environment;

    const query = `auditId=${auditId}&planAndReport=${planAndReport}`;
    const url = `${documentsApi}/AuditDocumentList?${query}`;

    return this.httpClient.get<AuditDocumentsListDto>(url);
  }
}
