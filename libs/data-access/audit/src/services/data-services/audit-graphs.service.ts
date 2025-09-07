import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  AuditGraphsFilterCompaniesDto,
  AuditGraphsFilterServicesDto,
  AuditGraphsFilterSitesDto,
} from '../../dtos';
import {
  AUDIT_DAYS_BAR_CHART_QUERY,
  AUDIT_DAYS_DOUGHNUT_CHART_QUERY,
  AUDIT_GRAPHS_FILTER_COMPANIES_QUERY,
  AUDIT_GRAPHS_FILTER_SERVICES_QUERY,
  AUDIT_GRAPHS_FILTER_SITES_QUERY,
  AUDIT_STATUS_BAR_CHART_QUERY,
  AUDIT_STATUS_DOUGHNUT_CHART_QUERY,
} from '../../graphql';

@Injectable({ providedIn: 'root' })
export class AuditGraphsService {
  private clientName = 'audit';

  constructor(private readonly apollo: Apollo) {}

  getAuditStatusDoughnutGraphData(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_STATUS_DOUGHNUT_CHART_QUERY,
        variables: {
          startDate,
          endDate,
          companies,
          services,
          sites,
        },
      })
      .pipe(map((results: any) => results.data.auditStatusStats));
  }

  getAuditStatusBarGraphData(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_STATUS_BAR_CHART_QUERY,
        variables: {
          startDate,
          endDate,
          companies,
          services,
          sites,
        },
      })
      .pipe(map((results: any) => results.data.auditTypeStats));
  }

  getAuditDaysDoughnutGraphData(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_DAYS_DOUGHNUT_CHART_QUERY,
        variables: {
          filters: {
            startDate,
            endDate,
            companies,
            services,
            sites,
          },
        },
      })
      .pipe(map((results: any) => results.data?.auditDaysbyServicePieChart));
  }

  getAuditDaysBarGraphData(
    startDate: Date,
    endDate: Date,
    companyFilter: number[],
    serviceFilter: number[],
    siteFilter: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_DAYS_BAR_CHART_QUERY,
        variables: {
          startDate,
          endDate,
          companyFilter,
          serviceFilter,
          siteFilter,
        },
      })
      .pipe(map((results: any) => results.data?.getAuditDaysByMonthAndService));
  }

  getAuditGraphsFilterCompanies(
    startDate: Date,
    endDate: Date,
    services: number[],
    sites: number[],
  ): Observable<AuditGraphsFilterCompaniesDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_GRAPHS_FILTER_COMPANIES_QUERY,
        variables: {
          startDate,
          endDate,
          services,
          sites,
        },
      })
      .pipe(map((results: any) => results?.data?.companiesFilter));
  }

  getAuditGraphsFilterServices(
    startDate: Date,
    endDate: Date,
    companies: number[],
    sites: number[],
  ): Observable<AuditGraphsFilterServicesDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_GRAPHS_FILTER_SERVICES_QUERY,
        variables: {
          startDate,
          endDate,
          companies,
          sites,
        },
      })
      .pipe(map((results: any) => results?.data?.servicesFilter));
  }

  getAuditGraphsFilterSites(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
  ): Observable<AuditGraphsFilterSitesDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_GRAPHS_FILTER_SITES_QUERY,
        variables: {
          startDate,
          endDate,
          companies,
          services,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.sitesFilter));
  }
}
