import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  FindingGraphsFilterCompaniesDto,
  FindingGraphsFilterSitesDto,
  FindingsTrendsGraphDto,
} from '../../dtos';
import { FindingsTrendsDataDto } from '../../dtos/findings-trends-data.dto';
import {
  FINDING_GRAPHS_FILTER_COMPANIES_QUERY,
  FINDING_GRAPHS_FILTER_SERVICES_QUERY,
  FINDING_GRAPHS_FILTER_SITES_QUERY,
  FINDING_STATUS_BY_CATEGORY_GRAPH_QUERY,
  FINDING_TRENDS_LIST_QUERY,
  FINDINGS_BY_CLAUSE_LIST_QUERY,
  FINDINGS_BY_SITE_LIST_QUERY,
  FINDINGS_BY_STATUS_GRAPH_QUERY,
  FINDINGS_TRENDS_GRAPH_QUERY,
  OPEN_FINDINGS_GRAPH_QUERY,
} from '../../graphql';
import { OpenFindingsMonthsPeriod } from '../../models';

@Injectable({ providedIn: 'root' })
export class FindingGraphsService {
  private clientName = 'finding';

  constructor(private readonly apollo: Apollo) {}

  // #region FindingStatusGraphs
  getFindingStatusByCategoryGraphData(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    sites: number[],
  ) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDING_STATUS_BY_CATEGORY_GRAPH_QUERY,
        variables: {
          startDate,
          endDate,
          companies,
          services,
          sites,
        },
      })
      .pipe(map((results: any) => results?.data?.findingsCategoryStats));
  }

  getFindingsByStatusGraphData(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDINGS_BY_STATUS_GRAPH_QUERY,
        variables: {
          startDate,
          endDate,
          companies,
          services,
          sites,
        },
      })
      .pipe(map((results: any) => results?.data?.findingsStatusStats));
  }
  // #endregion FindingStatusGraphs

  // #region FindingTrendsGraphs
  getFindingsTrendsGraphData(
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<FindingsTrendsGraphDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDINGS_TRENDS_GRAPH_QUERY,
        variables: {
          companies,
          services,
          sites,
        },
      })
      .pipe(map((results: any) => results?.data?.findingsByCategory));
  }

  getFindingsTrendsData(
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<FindingsTrendsDataDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDING_TRENDS_LIST_QUERY,
        variables: { companies, services, sites },
      })
      .pipe(map((results: any) => results.data.trendList));
  }

  // #endregion FindingTrendsGraphs

  // #region OpenFindingsGraphs
  getOpenFindingsGraphData(
    period: OpenFindingsMonthsPeriod,
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    sites: number[],
    responsetype: string,
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: OPEN_FINDINGS_GRAPH_QUERY,
        variables: {
          period,
          startDate,
          endDate,
          companies,
          services,
          sites,
          responsetype,
        },
      })
      .pipe(map((results: any) => results.data.getOpenFindingschartviewData));
  }

  // #endregion OpenFindingsGraphs

  // #region FindingGraphFilters
  getFindingGraphsFilterCompanies(
    startDate: Date,
    endDate: Date,
    services: number[],
    sites: number[],
  ): Observable<FindingGraphsFilterCompaniesDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDING_GRAPHS_FILTER_COMPANIES_QUERY,
        variables: {
          startDate,
          endDate,
          services,
          sites,
        },
      })
      .pipe(map((results: any) => results?.data?.companiesFilter));
  }

  getFindingGraphsFilterServices(
    startDate: Date,
    endDate: Date,
    companies: number[],
    sites: number[],
  ) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDING_GRAPHS_FILTER_SERVICES_QUERY,
        variables: {
          startDate,
          endDate,
          companies,
          sites,
        },
      })
      .pipe(map((results: any) => results?.data?.servicesFilter));
  }

  getFindingGraphsFilterSites(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
  ): Observable<FindingGraphsFilterSitesDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDING_GRAPHS_FILTER_SITES_QUERY,
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

  // #endregion FindingGraphFilters

  // #region FindingsByClause
  getFindingsByClauseList(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDINGS_BY_CLAUSE_LIST_QUERY,
        variables: {
          filters: {
            startDate,
            endDate,
            companies,
            services,
            sites,
          },
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.findingsByClauseList));
  }
  // #endregion FindingsByClause

  // #region FindingsBySite
  getFindingsBySiteList(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    country: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDINGS_BY_SITE_LIST_QUERY,
        variables: {
          companies,
          services,
          startDate,
          endDate,
          country,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.getFindingBySite));
  }
}
