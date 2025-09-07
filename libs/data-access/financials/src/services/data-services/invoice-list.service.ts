import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { InvoiceExcelPayloadDto, InvoiceListDto } from '../../dtos';
import { InvoiceDownloadDataDto } from '../../dtos/invoice-download-data.dto';
import { UPDATE_PLANNED_PAYMENT_DATE_MUTATION } from '../../graphql/mutations';
import {
  DOWNLOAD_INVOICES_QUERY,
  INVOICE_LIST_QUERY,
} from '../../graphql/queries';

@Injectable({ providedIn: 'root' })
export class InvoiceListService {
  private clientName = 'invoice';

  private readonly exportInvoiceExcelUrl = `${environment.documentsApi}/ExportFinancials`;

  constructor(
    private readonly apollo: Apollo,
    private http: HttpClient,
  ) {}

  getInvoiceList(): Observable<InvoiceListDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: INVOICE_LIST_QUERY,
        variables: {},
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.InvoiceListPage));
  }

  exportInvoices({ filters }: InvoiceExcelPayloadDto): Observable<number[]> {
    return this.http
      .post<{ data: number[] }>(this.exportInvoiceExcelUrl, { filters })
      .pipe(map((response) => response.data));
  }

  downloadInvoices(
    invoiceNumbers: string[],
  ): Observable<InvoiceDownloadDataDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: DOWNLOAD_INVOICES_QUERY,
        variables: {
          invoiceNumber: invoiceNumbers,
        },
      })
      .pipe(map((results: any) => results.data.DownloadInvoice.data));
  }

  updatePlannedPaymentDate(invoicesId: string[], date: string) {
    return this.apollo.use(this.clientName).mutate({
      mutation: UPDATE_PLANNED_PAYMENT_DATE_MUTATION,
      variables: {
        invoiceNumber: invoicesId,
        plannedDates: date,
      },
    });
  }
}
