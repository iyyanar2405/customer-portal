import { EMPTY_GRAPH_DATA } from '@customer-portal/shared';

import { FindingTabs, OpenFindingsResponse } from '../../models';
import { FindingGraphsStateModel } from '../finding-graphs.state';
import { FindingGraphsSelectors } from './finding-graphs.selectors';

describe('FindingGraphsSelectors', () => {
  const mockState: FindingGraphsStateModel = {
    activeTab: FindingTabs.FindingStatus,
    becomingOverdueFindingsGraphData: EMPTY_GRAPH_DATA,
    earlyStageFindingsGraphData: EMPTY_GRAPH_DATA,
    findingsTrendsGraphData: EMPTY_GRAPH_DATA,
    findingsByStatusGraphData: EMPTY_GRAPH_DATA,
    findingStatusByCategoryGraphData: EMPTY_GRAPH_DATA,
    findingsByClauseList: [
      {
        label: 'clause 1',
        children: [
          {
            label: 'clause 1a',
            children: [
              {
                label: 'clause 1aa',
                children: [
                  {
                    label: 'clause 1aaa',
                    type: 'selection',
                  },
                ],
              },
              {
                label: 'clause 1b',
                children: [],
              },
            ],
          },
          {
            label: 'clause 2',
            children: [
              {
                label: 'clause 2a',
                children: [
                  {
                    label: 'clause 2aa',
                    type: 'selection',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    findingsByClauseListGradient: {
      clause1: new Map([
        [1, '#ff0000'],
        [2, '#00ff00'],
      ]),
      clause2: new Map([
        [1, '#0000ff'],
        [2, '#ffff00'],
      ]),
    },
    findingsBySiteList: [],
    findingsBySiteListGradient: {},
    findingsTrendsColumns: [
      { field: 'name', header: 'Name', isTranslatable: true },
      { field: 'value', header: 'Value', isTranslatable: true },
    ],
    findingsTrendsData: [
      {
        label: 'node 1',
        children: [
          {
            label: 'node 1a',
            children: [
              {
                label: 'node 1aa',
                children: [
                  {
                    label: 'node 1aaa',
                    type: 'selection',
                  },
                ],
              },
              {
                label: 'node 1b',
                children: [],
              },
            ],
          },
          {
            label: 'node 2',
            children: [
              {
                label: 'node 2a',
                children: [
                  {
                    label: 'node 2aa',
                    type: 'selection',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    findingsTrendsGradient: new Map([
      [0, '#ff0000'],
      [50, '#00ff00'],
      [100, '#0000ff'],
    ]),
    inProgressFindingsGraphData: EMPTY_GRAPH_DATA,
    openFindingsResponse: OpenFindingsResponse.NoResponse,
    overdueFindingsGraphData: EMPTY_GRAPH_DATA,
    filterStartDate: new Date(),
    filterEndDate: new Date(),
    filterCompanies: [1, 2],
    filterServices: [1, 2],
    filterSites: [1, 2],
    dataCompanies: [{ label: 'company 1', value: 5 }],
    dataServices: [{ label: 'service 1', value: 10 }],
    dataSites: [{ label: 'service 1', children: [] }],
    prefillCompanies: [1, 2],
    prefillServices: [1, 2],
    prefillSites: [{ label: 'site 1', children: [] }],
  };
  test('should select findings trends data', () => {
    // Arrange
    const { findingsTrendsData } = mockState;

    // Act
    const result =
      FindingGraphsSelectors.findingsTrendsData(findingsTrendsData);

    // Assert
    expect(result).toEqual(findingsTrendsData);
  });

  test('should select findings trends columns', () => {
    // Arrange
    const { findingsTrendsColumns } = mockState;

    // Act
    const result = FindingGraphsSelectors.findingsTrendsColumns(
      findingsTrendsColumns,
    );

    // Assert
    expect(result).toEqual(findingsTrendsColumns);
  });

  test('should select findings trends gradient', () => {
    // Arrange
    const { findingsTrendsGradient } = mockState;

    // Act
    const result = FindingGraphsSelectors.findingsTrendsGradient(
      findingsTrendsGradient,
    );

    // Assert
    expect(result).toEqual(findingsTrendsGradient);
  });

  test('should select findings by clause data', () => {
    // Arrange
    const { findingsByClauseList } = mockState;

    // Act
    const result =
      FindingGraphsSelectors.findingsByClauseList(findingsByClauseList);

    // Assert
    expect(result).toEqual(findingsByClauseList);
  });

  test('should select findings by clause data gradient', () => {
    // Arrange
    const { findingsByClauseListGradient } = mockState;

    // Act
    const result = FindingGraphsSelectors.findingsByClauseListGradient(
      findingsByClauseListGradient,
    );

    // Assert
    expect(result).toEqual(findingsByClauseListGradient);
  });

  test('should select findings trends data', () => {
    // Arrange
    const state: FindingGraphsStateModel = { ...mockState };

    // Act
    const result = (FindingGraphsSelectors as any)._findingsTrendsData(state);

    // Assert
    expect(result).toEqual(state.findingsTrendsData);
  });

  test('should return an empty array when findingsTrendsData is not available', () => {
    // Arrange
    const state: FindingGraphsStateModel = { ...mockState };
    state.findingsTrendsData = [];

    // Act
    const result = (FindingGraphsSelectors as any)._findingsTrendsData(state);

    // Assert
    expect(result).toEqual([]);
  });

  test('should select findings trends columns', () => {
    // Arrange
    const state: FindingGraphsStateModel = { ...mockState };

    // Act
    const result = (FindingGraphsSelectors as any)._findingsTrendsColumns(
      state,
    );

    // Assert
    expect(result).toEqual(state.findingsTrendsColumns);
  });

  test('should return an empty array when findingsTrendsColumns is not available', () => {
    // Arrange
    const state: FindingGraphsStateModel = { ...mockState };
    state.findingsTrendsColumns = [];

    // Act
    const result = (FindingGraphsSelectors as any)._findingsTrendsColumns(
      state,
    );

    // Assert
    expect(result).toEqual([]);
  });

  test('should select findings trends gradient', () => {
    // Arrange
    const state: FindingGraphsStateModel = mockState;

    // Act
    const result = (FindingGraphsSelectors as any)._findingsTrendsGradient(
      state,
    );

    // Assert
    expect(result).toEqual(state.findingsTrendsGradient);
  });

  test('should return new map when findingsTrendsGradient is not available', () => {
    // Arrange
    const state: FindingGraphsStateModel = { ...mockState };
    state.findingsTrendsGradient = new Map<number, string>();

    // Act
    const result = (FindingGraphsSelectors as any)._findingsTrendsGradient(
      state,
    );

    // Assert
    expect(result).toEqual(new Map<number, string>());
  });

  test('should select findings by clause data', () => {
    // Arrange
    const state: FindingGraphsStateModel = { ...mockState };

    // Act
    const result = (FindingGraphsSelectors as any)._findingsByClauseList(state);

    // Assert
    expect(result).toEqual(state.findingsByClauseList);
  });

  test('should return an empty array when findingsByClauseList is not available', () => {
    // Arrange
    const state: FindingGraphsStateModel = { ...mockState };
    state.findingsByClauseList = [];

    // Act
    const result = (FindingGraphsSelectors as any)._findingsByClauseList(state);

    // Assert
    expect(result).toEqual([]);
  });

  test('should select findings by clause data gradient', () => {
    // Arrange
    const state: FindingGraphsStateModel = { ...mockState };

    // Act
    const result = (
      FindingGraphsSelectors as any
    )._findingsByClauseListGradient(state);

    // Assert
    expect(result).toEqual(state.findingsByClauseListGradient);
  });

  test('should return an empty object when findingsByClauseListGradient is not available', () => {
    // Arrange
    const state: FindingGraphsStateModel = { ...mockState };
    state.findingsByClauseListGradient = { G1: new Map() };

    // Act
    const result = (
      FindingGraphsSelectors as any
    )._findingsByClauseListGradient(state);

    // Assert
    expect(result).toEqual({ G1: new Map() });
  });
});
