import { TestBed } from '@angular/core/testing';
import { Navigate } from '@ngxs/router-plugin';
import {
  Actions,
  NgxsModule,
  ofActionDispatched,
  StateContext,
  Store,
} from '@ngxs/store';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';

import {
  BarChartModel,
  DoughnutChartModel,
  EMPTY_GRAPH_DATA,
} from '@customer-portal/shared';

import { createFindingGraphServiceMock } from '../__mocks__';
import {
  FindingTabs,
  FindingTrendsGraphModel,
  OpenFindingsMonthsPeriod,
  OpenFindingsResponse,
} from '../models';
import { FindingGraphsService } from '../services';
import {
  LoadBecomingOverdueFindingsGraphData,
  LoadBecomingOverdueFindingsGraphDataSuccess,
  LoadEarlyStageFindingsGraphData,
  LoadEarlyStageFindingsGraphDataSuccess,
  LoadFindingsByClauseList,
  LoadFindingsByClauseListSuccess,
  LoadFindingsBySiteList,
  LoadFindingsBySiteListSuccess,
  LoadFindingsByStatusGraphData,
  LoadFindingsByStatusGraphDataSuccess,
  LoadFindingsGraphsData,
  LoadFindingStatusByCategoryGraphData,
  LoadFindingStatusByCategoryGraphDataSuccess,
  LoadFindingsTrendsGraphData,
  LoadFindingsTrendsGraphDataSuccess,
  LoadInProgressFindingsGraphData,
  LoadInProgressFindingsGraphDataSuccess,
  LoadOverdueFindingsGraphData,
  LoadOverdueFindingsGraphDataSuccess,
  ResetFindingsGraphData,
  SetActiveFindingsTab,
  SetNavigationGridConfig,
} from './actions';
import {
  FindingGraphsState,
  FindingGraphsStateModel,
} from './finding-graphs.state';
import {
  defaultDataWhenActiveTabIsUnrecognized,
  defaultState,
  navigateListViewMockState,
  resetFindingsGraphDataDefault,
  setStatusWhenActiveTabIsFindingStatusDefault,
  setStatusWhenActiveTabIsOpenFindingsDefault,
} from './finding-graphs.state.mock';
import { FindingGraphsSelectors } from './selectors';

describe('FindingGraphsState', () => {
  let store: Store;
  let state: FindingGraphsState;
  let actions$: Observable<any>;

  const findingGraphsServiceMock: Partial<FindingGraphsService> =
    createFindingGraphServiceMock();

  beforeEach(() => {
    jest.clearAllMocks();

    const apolloMock: Partial<Apollo> = {
      use: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([FindingGraphsState])],
      providers: [
        {
          provide: Apollo,
          useValue: apolloMock,
        },
        {
          provide: FindingGraphsService,
          useValue: findingGraphsServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store);
    state = TestBed.inject(FindingGraphsState);
    actions$ = TestBed.inject(Actions);
  });

  describe('setActiveFindingsTab', () => {
    test('should set the activeTab in state', () => {
      // Arrange
      const action = new SetActiveFindingsTab(FindingTabs.OpenFindings);
      const expectedActiveTab = FindingTabs.OpenFindings;

      // Act
      store.dispatch(action);

      const actualActiveTabInState = store.selectSnapshot(
        (s) => s.findingGraphs.activeTab,
      );

      // Assert
      expect(actualActiveTabInState).toEqual(expectedActiveTab);
    });
  });

  describe('resetFindingsGraphsState', () => {
    test('should reset the state to default', () => {
      // Arrange
      const action = new ResetFindingsGraphData();

      // Act
      store.dispatch(action);

      const actualState = store.selectSnapshot((s) => s.findingGraphs);

      // Assert
      expect(actualState).toMatchObject({
        ...defaultState,
        filterStartDate: expect.any(Date),
        filterEndDate: expect.any(Date),
      });
    });
  });

  describe('resetFindingsGraphData', () => {
    test('should set open findings and trends related charts to EMPTY_GRAPH_DATA when activeTab is FindingStatus', () => {
      // Arrange

      store.reset(resetFindingsGraphDataDefault);

      // Act
      store.dispatch(new ResetFindingsGraphData());

      const actualOverdueFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.overdueFindingsGraphData,
      );

      const actualBecomingOverdueFindingsGraphDataInState =
        store.selectSnapshot(
          FindingGraphsSelectors.becomingOverdueFindingsGraphData,
        );

      const actualInProgressFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.inProgressFindingsGraphData,
      );

      const actualEarlyStageFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.earlyStageFindingsGraphData,
      );

      const actualFindingsTrendsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.findingsTrendsGraphData,
      );

      const actualOpenFindingResponseInState = store.selectSnapshot(
        (currentState) => currentState.findingGraphs.openFindingsResponse,
      );

      // Assert
      expect(actualOverdueFindingsGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualBecomingOverdueFindingsGraphDataInState).toBe(
        EMPTY_GRAPH_DATA,
      );
      expect(actualInProgressFindingsGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualEarlyStageFindingsGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualFindingsTrendsGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualOpenFindingResponseInState).toBe(
        OpenFindingsResponse.NoResponse,
      );
    });

    test('should set finding status and trends related graphs data to EMPTY_GRAPH_DATA when activeTab is OpenFindings', () => {
      // Arrange

      store.reset(setStatusWhenActiveTabIsOpenFindingsDefault);

      // Act
      store.dispatch(new ResetFindingsGraphData());

      const actualFindingsByStatusGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.findingsByStatusGraphData,
      );

      const actualFindingStatusByCategoryGraphDataInState =
        store.selectSnapshot(
          FindingGraphsSelectors.findingStatusByCategoryGraphData,
        );

      const actualFindingsTrendsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.findingsTrendsGraphData,
      );

      // Assert
      expect(actualFindingsByStatusGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualFindingStatusByCategoryGraphDataInState).toBe(
        EMPTY_GRAPH_DATA,
      );
      expect(actualFindingsTrendsGraphDataInState).toBe(EMPTY_GRAPH_DATA);
    });

    test('should set finding status and open findings related graphs data to EMPTY_GRAPH_DATA when activeTab is FindingStatus', () => {
      // Arrange
      store.reset(setStatusWhenActiveTabIsFindingStatusDefault);

      // Act
      store.dispatch(new ResetFindingsGraphData());

      const actualFindingsByStatusGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.findingsByStatusGraphData,
      );

      const actualFindingStatusByCategoryGraphDataInState =
        store.selectSnapshot(
          FindingGraphsSelectors.findingStatusByCategoryGraphData,
        );

      const actualOverdueFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.overdueFindingsGraphData,
      );

      const actualBecomingOverdueFindingsGraphDataInState =
        store.selectSnapshot(
          FindingGraphsSelectors.becomingOverdueFindingsGraphData,
        );

      const actualInProgressFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.inProgressFindingsGraphData,
      );

      const actualEarlyStageFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.earlyStageFindingsGraphData,
      );

      // Assert
      expect(actualFindingsByStatusGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualFindingStatusByCategoryGraphDataInState).toBe(
        EMPTY_GRAPH_DATA,
      );
      expect(actualOverdueFindingsGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualBecomingOverdueFindingsGraphDataInState).toBe(
        EMPTY_GRAPH_DATA,
      );
      expect(actualInProgressFindingsGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualEarlyStageFindingsGraphDataInState).toBe(EMPTY_GRAPH_DATA);
    });

    test('should not clear graph data properties if activeTab is unrecognized', () => {
      // Arrange

      store.reset(defaultDataWhenActiveTabIsUnrecognized);

      // Act
      store.dispatch(new ResetFindingsGraphData());

      const actualBecomingOverdueFindingsGraphDataInState =
        store.selectSnapshot(
          FindingGraphsSelectors.becomingOverdueFindingsGraphData,
        );

      const actualEarlyStageFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.earlyStageFindingsGraphData,
      );
      const actualInProgressFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.inProgressFindingsGraphData,
      );
      const actualOverdueFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.overdueFindingsGraphData,
      );
      const actualFindingsByStatusGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.findingsByStatusGraphData,
      );
      const actualFindingStatusByCategoryGraphDataInState =
        store.selectSnapshot(
          FindingGraphsSelectors.findingStatusByCategoryGraphData,
        );
      const actualFindingsTrendsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.findingsTrendsGraphData,
      );

      // Assert
      expect(actualBecomingOverdueFindingsGraphDataInState).toEqual({
        data: {},
      });
      expect(actualEarlyStageFindingsGraphDataInState).toEqual({
        data: {},
      });
      expect(actualInProgressFindingsGraphDataInState).toEqual({
        data: {},
      });
      expect(actualOverdueFindingsGraphDataInState).toEqual({
        data: {},
      });
      expect(actualFindingsByStatusGraphDataInState).toEqual({
        data: {},
      });
      expect(actualFindingStatusByCategoryGraphDataInState).toEqual({
        data: {},
      });
      expect(actualFindingsTrendsGraphDataInState).toEqual({
        data: {},
      });
    });
  });

  describe('navigateFromChartToListView', () => {
    test('should dispatch correct actions when navigating to the list view', () => {
      const ctx: Partial<StateContext<FindingGraphsStateModel>> = {
        getState: jest.fn().mockReturnValue(navigateListViewMockState),
        patchState: jest.fn(),
        dispatch: jest.fn().mockReturnValue(of(null)),
      };

      const tooltipFilters = [{ label: 'openDate', value: '2024' }];

      store.reset({
        ...store.snapshot(),
        findingGraphs: navigateListViewMockState,
      });

      const expectedServiceFilters = [{ label: 'services', value: [] }];
      const expectedCitiesFilters = [{ label: 'city', value: [] }];
      const expectedSiteFilters = [{ label: 'site', value: [] }];
      const expectedCompanyFilters = [{ label: 'companyName', value: [] }];

      (ctx.getState as jest.Mock).mockReturnValue(navigateListViewMockState);

      // Act
      state.navigateFromChartToListView(
        ctx as StateContext<FindingGraphsStateModel>,
        {
          tooltipFilters,
        },
      );
      const dispatchCalls = (ctx.dispatch as jest.Mock).mock.calls;

      // Assert
      expect(dispatchCalls[0]).toEqual([
        new SetNavigationGridConfig([
          ...tooltipFilters,
          ...expectedServiceFilters,
          ...expectedCitiesFilters,
          ...expectedSiteFilters,
          ...expectedCompanyFilters,
        ]),
      ]);

      expect(dispatchCalls[1]).toEqual([new Navigate(['/findings'])]);
    });
  });

  describe('loadFindingStatusByCategoryGraphData', () => {
    test('should call getFindingStatusByCategoryGraphData', () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];

      store.reset({
        findingGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      // Act
      store.dispatch(new LoadFindingStatusByCategoryGraphData());

      // Assert
      expect(
        findingGraphsServiceMock.getFindingStatusByCategoryGraphData,
      ).toHaveBeenCalledWith(
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
      );
    });
  });

  describe('loadFindingStatusByCategoryGraphDataSuccess', () => {
    test('should write in state findingStatusByCategoryGraphData', () => {
      // Arrange
      const findingStatusByCategoryGraphData: BarChartModel = {
        data: {
          labels: [
            'CAT2 (Minor)',
            'Observation',
            'Opportunity for Improvement',
          ],
          datasets: [
            {
              label: 'Open',
              data: [2, 2, 2],
              backgroundColor: '#FAF492',
            },
          ],
        },
      };

      // Act
      store.dispatch(
        new LoadFindingStatusByCategoryGraphDataSuccess(
          findingStatusByCategoryGraphData,
        ),
      );

      const actualFindingStatusByCategoryGraphDataInState =
        store.selectSnapshot(
          FindingGraphsSelectors.findingStatusByCategoryGraphData,
        );

      // Assert
      expect(actualFindingStatusByCategoryGraphDataInState).toEqual(
        findingStatusByCategoryGraphData,
      );
    });
  });

  describe('loadFindingsByStatusGraphData', () => {
    test('should call getFindingsByStatusGraphData', () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];

      store.reset({
        findingGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      // Act
      store.dispatch(new LoadFindingsByStatusGraphData());

      // Assert
      expect(
        findingGraphsServiceMock.getFindingsByStatusGraphData,
      ).toHaveBeenCalledWith(
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
      );
    });
  });

  describe('loadFindingsByStatusGraphDataSuccess', () => {
    test('should write in state findingsByStatusGraphData', () => {
      // Arrange
      const findingsByStatusGraphData: DoughnutChartModel = {
        data: {
          labels: ['Open'],
          datasets: [
            {
              data: [6],
              backgroundColor: ['#FAF492'],
              hoverBackgroundColor: ['#FAF492'],
            },
          ],
          percentageValues: {
            Open: 100,
          },
        },
      };

      // Act
      store.dispatch(
        new LoadFindingsByStatusGraphDataSuccess(findingsByStatusGraphData),
      );

      const actualFindingsByStatusGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.findingsByStatusGraphData,
      );

      // Assert
      expect(actualFindingsByStatusGraphDataInState).toEqual(
        findingsByStatusGraphData,
      );
    });
  });

  describe('loadOpenFindingsGraphData', () => {
    test('should call getOpenFindingsGraphData', () => {
      // Arrange
      const period = OpenFindingsMonthsPeriod.Overdue;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];
      const response = OpenFindingsResponse.NoResponse;

      store.reset({
        findingGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      // Act
      store.dispatch(new LoadOverdueFindingsGraphData());

      // Assert
      expect(
        findingGraphsServiceMock.getOpenFindingsGraphData,
      ).toHaveBeenCalledWith(
        period,
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
        response,
      );
    });
  });

  describe('loadOverdueFindingsGraphDataSuccess', () => {
    test('should write in state overdueFindingsGraphData', () => {
      // Arrange
      const overdueFindingsGraphData: BarChartModel = {
        data: {
          labels: ['HACCP'],
          datasets: [
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
      };

      // Act
      store.dispatch(
        new LoadOverdueFindingsGraphDataSuccess(overdueFindingsGraphData),
      );

      const actualOverdueFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.overdueFindingsGraphData,
      );

      // Assert
      expect(actualOverdueFindingsGraphDataInState).toEqual(
        overdueFindingsGraphData,
      );
    });
  });

  describe('loadBecomingOverdueFindingsGraphData', () => {
    test('should call getOpenFindingsGraphData', () => {
      // Arrange
      const period = OpenFindingsMonthsPeriod.BecomingOverdue;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];
      const response = OpenFindingsResponse.NoResponse;

      store.reset({
        findingGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      const getOpenFindingsGraphDataSpy = jest.spyOn(
        findingGraphsServiceMock,
        'getOpenFindingsGraphData',
      );

      // Act
      store.dispatch(new LoadBecomingOverdueFindingsGraphData());

      // Assert
      expect(getOpenFindingsGraphDataSpy).toHaveBeenCalledWith(
        period,
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
        response,
      );
    });
  });

  describe('loadBecomingOverdueFindingsGraphDataSuccess', () => {
    test('should write in state becomingOverdueFindingsGraphData', () => {
      // Arrange
      const becomingOverdueFindingsGraphData: BarChartModel = {
        data: {
          labels: ['HACCP'],
          datasets: [
            {
              label: 'CAT2 (Minor)',
              data: [1],
              backgroundColor: '#FFF699',
            },
            {
              label: 'Opportunity for Improvement',
              data: [1],
              backgroundColor: '#FBB482',
            },
          ],
        },
      };

      // Act
      store.dispatch(
        new LoadBecomingOverdueFindingsGraphDataSuccess(
          becomingOverdueFindingsGraphData,
        ),
      );

      const actualBecomingOverdueFindingsGraphDataInState =
        store.selectSnapshot(
          FindingGraphsSelectors.becomingOverdueFindingsGraphData,
        );

      // Assert
      expect(actualBecomingOverdueFindingsGraphDataInState).toEqual(
        becomingOverdueFindingsGraphData,
      );
    });
  });

  describe('loadOverdueFindingsGraphDataSuccess', () => {
    test('should write in state overdueFindingsGraphData', () => {
      // Arrange
      const overdueFindingsGraphData: BarChartModel = {
        data: {
          labels: ['HACCP'],
          datasets: [
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
      };

      // Act
      store.dispatch(
        new LoadOverdueFindingsGraphDataSuccess(overdueFindingsGraphData),
      );

      const actualOverdueFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.overdueFindingsGraphData,
      );

      // Assert
      expect(actualOverdueFindingsGraphDataInState).toEqual(
        overdueFindingsGraphData,
      );
    });
  });

  describe('loadInProgressFindingsGraphData', () => {
    test('should call getOpenFindingsGraphData', () => {
      // Arrange
      const period = OpenFindingsMonthsPeriod.InProgress;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];
      const response = OpenFindingsResponse.NoResponse;

      store.reset({
        findingGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      const getOpenFindingsGraphDataSpy = jest.spyOn(
        findingGraphsServiceMock,
        'getOpenFindingsGraphData',
      );

      // Act
      store.dispatch(new LoadInProgressFindingsGraphData());

      // Assert
      expect(getOpenFindingsGraphDataSpy).toHaveBeenCalledWith(
        period,
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
        response,
      );
    });
  });

  describe('loadInProgressFindingsGraphDataSuccess', () => {
    test('should write in state inProgressFindingsGraphData', () => {
      // Arrange
      const inProgressFindingsGraphData: BarChartModel = {
        data: {
          labels: ['HACCP'],
          datasets: [
            {
              label: 'CAT2 (Minor)',
              data: [1],
              backgroundColor: '#FFF699',
            },
          ],
        },
      };

      // Act
      store.dispatch(
        new LoadInProgressFindingsGraphDataSuccess(inProgressFindingsGraphData),
      );

      const actualInProgressFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.inProgressFindingsGraphData,
      );

      // Assert
      expect(actualInProgressFindingsGraphDataInState).toEqual(
        inProgressFindingsGraphData,
      );
    });
  });

  describe('loadEarlyStageFindingsGraphData', () => {
    test('should call getOpenFindingsGraphData', () => {
      // Arrange
      const period = OpenFindingsMonthsPeriod.EarlyStage;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];
      const response = OpenFindingsResponse.NoResponse;

      store.reset({
        findingGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      const getOpenFindingsGraphDataSpy = jest.spyOn(
        findingGraphsServiceMock,
        'getOpenFindingsGraphData',
      );

      // Act
      store.dispatch(new LoadEarlyStageFindingsGraphData());

      // Assert
      expect(getOpenFindingsGraphDataSpy).toHaveBeenCalledWith(
        period,
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
        response,
      );
    });
  });

  describe('loadEarlyStageFindingsGraphDataSuccess', () => {
    test('should write in state earlyStageFindingsGraphData', () => {
      // Arrange
      const earlyStageFindingsGraphData: BarChartModel = {
        data: {
          labels: ['HACCP'],
          datasets: [
            {
              label: 'Observation',
              data: [1],
              backgroundColor: '#AEE9FF',
            },
          ],
        },
      };

      // Act
      store.dispatch(
        new LoadEarlyStageFindingsGraphDataSuccess(earlyStageFindingsGraphData),
      );

      const actualEarlyStageFindingsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.earlyStageFindingsGraphData,
      );

      // Assert
      expect(actualEarlyStageFindingsGraphDataInState).toEqual(
        earlyStageFindingsGraphData,
      );
    });
  });

  describe('loadFindingsTrendsGraphData', () => {
    test('should call getFindingsTrendsGraphData', () => {
      // Arrange
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];

      store.reset({
        findingGraphs: {
          ...defaultState,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      // Act
      store.dispatch(new LoadFindingsTrendsGraphData());

      // Assert
      expect(
        findingGraphsServiceMock.getFindingsTrendsGraphData,
      ).toHaveBeenCalledWith(filterCompanies, filterServices, filterSites);
    });
  });

  describe('loadFindingsByCategoryGraphDataSuccess', () => {
    test('should write in state findingsTrendsGraphData', () => {
      // Arrange
      const findingsTrendsGraphData: FindingTrendsGraphModel = {
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
      };

      // Act
      store.dispatch(
        new LoadFindingsTrendsGraphDataSuccess(findingsTrendsGraphData),
      );

      const actualFindingsTrendsGraphDataInState = store.selectSnapshot(
        FindingGraphsSelectors.findingsTrendsGraphData,
      );

      // Assert
      expect(actualFindingsTrendsGraphDataInState).toEqual(
        findingsTrendsGraphData,
      );
    });
  });

  describe('FindingsByClause', () => {
    test('should load data for Findings by clause tab', (done) => {
      // Arrange
      store.reset({
        findingGraphs: {
          ...defaultState,
          activeTab: FindingTabs.FindingsByClause,
        },
      });

      actions$
        .pipe(ofActionDispatched(LoadFindingsGraphsData))
        .subscribe(() => {
          // Assert
          done();
        });

      // Act
      store.dispatch(new LoadFindingsGraphsData());
    });

    test('should call getFindingsByClauseList', () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = ['company1'];
      const filterServices = ['service1'];
      const filterSites = ['site1'];

      store.reset({
        findingGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      // Act
      store.dispatch(new LoadFindingsByClauseList());

      // Assert
      expect(
        findingGraphsServiceMock.getFindingsByClauseList,
      ).toHaveBeenCalledWith(
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
      );
    });

    test('should load findings by clause data and create gradient', () => {
      // Arrange
      const clauseDataDto = {
        data: [
          {
            data: {
              name: 'HACCP',
              majorCount: 0,
              minorCount: 4,
              observationCount: 0,
              toImproveCount: 0,
              totalCount: 4,
            },
            children: [
              {
                data: {
                  name: ' - ',
                  majorCount: 0,
                  minorCount: 4,
                  observationCount: 0,
                  toImproveCount: 0,
                  totalCount: 4,
                },
                children: [
                  {
                    data: {
                      name: '-',
                      majorCount: 0,
                      minorCount: 4,
                      observationCount: 0,
                      toImproveCount: 0,
                      totalCount: 4,
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const expectedGradient = {
        majorCount: new Map([[0, 'majorCount-7']]),
        minorCount: new Map([[4, 'minorCount-7']]),
        observationCount: new Map([[0, 'observationCount-7']]),
        toImproveCount: new Map([[0, 'toImproveCount-7']]),
        totalCount: new Map([[4, 'totalCount-7']]),
      };

      store.reset({
        findingGraphs: {
          ...defaultState,
        },
      });

      // Act
      store.dispatch(new LoadFindingsByClauseListSuccess(clauseDataDto.data));

      const actualFindings = store.selectSnapshot(
        FindingGraphsSelectors.findingsByClauseList,
      );

      const actualGradient = store.selectSnapshot(
        FindingGraphsSelectors.findingsByClauseListGradient,
      );

      // Assert
      expect(actualFindings).toEqual(clauseDataDto.data);
      expect(actualGradient).toEqual(expectedGradient);
    });
  });

  describe('FindingsBySite', () => {
    test('should load data for Findings by site tab', (done) => {
      // Arrange
      store.reset({
        findingGraphs: {
          ...defaultState,
          activeTab: FindingTabs.FindingsBySite,
        },
      });

      actions$
        .pipe(ofActionDispatched(LoadFindingsBySiteList))
        .subscribe(() => {
          // Assert
          done();
        });

      // Act
      store.dispatch(new LoadFindingsGraphsData());
    });

    test('should call getFindingsBySiteList', () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = ['company1'];
      const filterServices = ['service1'];
      const filterSites = ['site1'];

      store.reset({
        findingGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      // Act
      store.dispatch(new LoadFindingsBySiteList());

      // Assert
      expect(
        findingGraphsServiceMock.getFindingsBySiteList,
      ).toHaveBeenCalledWith(
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
      );
    });

    test('should load findings by site data and create gradient', () => {
      // Arrange
      const findingDataDto = {
        data: [
          {
            data: {
              id: 452,
              name: 'Switzerland',
              majorCount: 0,
              minorCount: 4,
              observationCount: 0,
              toImproveCount: 0,
              totalCount: 4,
            },
            children: [
              {
                data: {
                  name: 'Schindellegi',
                  majorCount: 0,
                  minorCount: 4,
                  observationCount: 0,
                  toImproveCount: 0,
                  totalCount: 4,
                },
                children: [
                  {
                    data: {
                      id: 7,
                      name: 'Kühne + Nagel Management AG',
                      majorCount: 0,
                      minorCount: 4,
                      observationCount: 0,
                      toImproveCount: 0,
                      totalCount: 4,
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const expectedGradient = {
        majorCount: new Map([[0, 'majorCount-7']]),
        minorCount: new Map([[4, 'minorCount-7']]),
        observationCount: new Map([[0, 'observationCount-7']]),
        toImproveCount: new Map([[0, 'toImproveCount-7']]),
        totalCount: new Map([[4, 'totalCount-7']]),
      };

      store.reset({
        findingGraphs: {
          ...defaultState,
        },
      });

      // Act
      store.dispatch(new LoadFindingsBySiteListSuccess(findingDataDto.data));

      const actualFindings = store.selectSnapshot(
        FindingGraphsSelectors.findingsBySiteList,
      );

      const actualGradient = store.selectSnapshot(
        FindingGraphsSelectors.findingsBySiteListGradient,
      );

      // Assert
      expect(actualFindings).toEqual(findingDataDto.data);
      expect(actualGradient).toEqual(expectedGradient);
    });
  });
});
