import { EMPTY_GRAPH_DATA } from '@customer-portal/shared';

import { FindingTabs, OpenFindingsResponse } from '../models';
import { FindingGraphsStateModel } from './finding-graphs.state';

export const defaultState = {
  activeTab: FindingTabs.FindingStatus,
  becomingOverdueFindingsGraphData: EMPTY_GRAPH_DATA,
  earlyStageFindingsGraphData: EMPTY_GRAPH_DATA,
  findingsTrendsGraphData: EMPTY_GRAPH_DATA,
  findingsByClauseList: [],
  findingsByClauseListGradient: {},
  findingsBySiteList: [],
  findingsBySiteListGradient: {},
  findingsByStatusGraphData: EMPTY_GRAPH_DATA,
  findingStatusByCategoryGraphData: EMPTY_GRAPH_DATA,
  findingsTrendsColumns: [],
  findingsTrendsData: [],
  findingsTrendsGradient: new Map<number, string>(),
  inProgressFindingsGraphData: EMPTY_GRAPH_DATA,
  openFindingsResponse: OpenFindingsResponse.NoResponse,
  overdueFindingsGraphData: EMPTY_GRAPH_DATA,
  filterStartDate: new Date(),
  filterEndDate: new Date(),
  filterCompanies: [],
  filterServices: [],
  filterSites: [],
  dataCompanies: [],
  dataServices: [],
  dataSites: [],
  prefillCompanies: [],
  prefillServices: [],
  prefillSites: [],
};

export const resetFindingsGraphDataDefault = {
  findingGraphs: {
    activeTab: FindingTabs.FindingStatus,
    overdueFindingsGraphData: {
      data: {
        labels: ['HACCP'],
        datasets: [
          {
            label: 'Observation',
            data: [10],
            backgroundColor: '#AEE9FF',
          },
          {
            label: 'Opportunity for Improvement',
            data: [1],
            backgroundColor: '#FBB482',
          },
        ],
      },
    },
    becomingOverdueFindingsGraphData: {
      data: {
        labels: ['HACCP'],
        datasets: [
          {
            label: 'CAT2 (Minor)',
            data: [1],
            backgroundColor: '#FFF699',
          },
          {
            label: 'Observation',
            data: [1],
            backgroundColor: '#AEE9FF',
          },
          {
            label: 'Opportunity for Improvement',
            data: [1],
            backgroundColor: '#FBB482',
          },
        ],
      },
    },
    inProgressFindingsGraphData: {
      data: {
        labels: ['HACCP'],
        datasets: [
          {
            label: 'CAT2 (Minor)',
            data: [1],
            backgroundColor: '#FFF699',
          },
          {
            label: 'Observation',
            data: [3],
            backgroundColor: '#AEE9FF',
          },
        ],
      },
    },
    earlyStageFindingsGraphData: {
      data: {
        labels: ['HACCP'],
        datasets: [
          {
            label: 'Observation',
            data: [3],
            backgroundColor: '#AEE9FF',
          },
        ],
      },
    },
    findingsByCategoryGraphData: {
      data: {
        labels: ['2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'CAT1 (Major)',
            data: [0, 4, 0, 0],
            borderColor: '#EB2A34',
            backgroundColor: '#EB2A34',
          },
          {
            label: 'CAT2 (Minor)',
            data: [7, 4, 1, 2],
            borderColor: '#FFE900',
            backgroundColor: '#FFE900',
          },
          {
            label: 'Observation',
            data: [2, 6, 0, 8],
            borderColor: '#33C8FF',
            backgroundColor: '#33C8FF',
          },
          {
            label: 'Noteworthy effort',
            data: [0, 0, 0, 0],
            borderColor: '#79BA72',
            backgroundColor: '#79BA72',
          },
          {
            label: 'Opportunity for improvement',
            data: [0, 0, 0, 2],
            borderColor: '#FBB482',
            backgroundColor: '#FBB482',
          },
        ],
      },
    },
    openFindingsResponse: OpenFindingsResponse.Response,
  },
};

export const setStatusWhenActiveTabIsOpenFindingsDefault = {
  findingGraphs: {
    activeTab: FindingTabs.OpenFindings,
    findingsByStatusGraphData: {
      data: {
        labels: ['Open'],
        datasets: [
          {
            data: [12],
            backgroundColor: ['#FAF492'],
            hoverBackgroundColor: ['#FAF492'],
          },
        ],
        percentageValues: {
          Open: 100,
        },
      },
    },
    findingStatusByCategoryGraphData: {
      data: {
        labels: ['CAT2 (Minor)', 'Observation', 'Opportunity for Improvement'],
        datasets: [
          {
            label: 'Open',
            data: [2, 8, 2],
            backgroundColor: '#FAF492',
          },
        ],
      },
    },
    findingsByCategoryGraphData: {
      data: {
        labels: ['2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'CAT1 (Major)',
            data: [0, 4, 0, 0],
            borderColor: '#EB2A34',
            backgroundColor: '#EB2A34',
          },
          {
            label: 'CAT2 (Minor)',
            data: [7, 4, 1, 2],
            borderColor: '#FFE900',
            backgroundColor: '#FFE900',
          },
          {
            label: 'Observation',
            data: [2, 6, 0, 8],
            borderColor: '#33C8FF',
            backgroundColor: '#33C8FF',
          },
          {
            label: 'Noteworthy effort',
            data: [0, 0, 0, 0],
            borderColor: '#79BA72',
            backgroundColor: '#79BA72',
          },
          {
            label: 'Opportunity for improvement',
            data: [0, 0, 0, 2],
            borderColor: '#FBB482',
            backgroundColor: '#FBB482',
          },
        ],
      },
    },
  },
};

export const setStatusWhenActiveTabIsFindingStatusDefault = {
  findingGraphs: {
    activeTab: FindingTabs.Trends,
    findingsByStatusGraphData: {
      data: {
        labels: ['Open'],
        datasets: [
          {
            data: [12],
            backgroundColor: ['#FAF492'],
            hoverBackgroundColor: ['#FAF492'],
          },
        ],
        percentageValues: {
          Open: 100,
        },
      },
    },
    findingStatusByCategoryGraphData: {
      data: {
        labels: ['CAT2 (Minor)', 'Observation', 'Opportunity for Improvement'],
        datasets: [
          {
            label: 'Open',
            data: [2, 8, 2],
            backgroundColor: '#FAF492',
          },
        ],
      },
    },
    overdueFindingsGraphData: {
      data: {
        labels: ['HACCP'],
        datasets: [
          {
            label: 'Observation',
            data: [10],
            backgroundColor: '#AEE9FF',
          },
          {
            label: 'Opportunity for Improvement',
            data: [1],
            backgroundColor: '#FBB482',
          },
        ],
      },
    },
    becomingOverdueFindingsGraphData: {
      data: {
        labels: ['HACCP'],
        datasets: [
          {
            label: 'CAT2 (Minor)',
            data: [1],
            backgroundColor: '#FFF699',
          },
          {
            label: 'Observation',
            data: [1],
            backgroundColor: '#AEE9FF',
          },
          {
            label: 'Opportunity for Improvement',
            data: [1],
            backgroundColor: '#FBB482',
          },
        ],
      },
    },
    inProgressFindingsGraphData: {
      data: {
        labels: ['HACCP'],
        datasets: [
          {
            label: 'CAT2 (Minor)',
            data: [1],
            backgroundColor: '#FFF699',
          },
          {
            label: 'Observation',
            data: [3],
            backgroundColor: '#AEE9FF',
          },
        ],
      },
    },
    earlyStageFindingsGraphData: {
      data: {
        labels: ['HACCP'],
        datasets: [
          {
            label: 'Observation',
            data: [3],
            backgroundColor: '#AEE9FF',
          },
        ],
      },
    },
  },
};

export const defaultDataWhenActiveTabIsUnrecognized = {
  findingGraphs: {
    ...defaultState,
    activeTab: 'UnknownTab' as FindingTabs,
    becomingOverdueFindingsGraphData: { data: {} },
    earlyStageFindingsGraphData: { data: {} },
    inProgressFindingsGraphData: { data: {} },
    overdueFindingsGraphData: { data: {} },
    findingsByStatusGraphData: { data: {} },
    findingStatusByCategoryGraphData: { data: {} },
    findingsTrendsGraphData: { data: {} },
  },
};

export const navigateListViewMockState: FindingGraphsStateModel = {
  ...defaultState,
  filterStartDate: new Date('2024-01-01'),
  filterEndDate: new Date('2024-12-31'),
  dataServices: [
    {
      label: 'service1',
      value: 0,
    },
    {
      label: 'service2',
      value: 1,
    },
  ],
  filterServices: [],
  prefillSites: [],
};
