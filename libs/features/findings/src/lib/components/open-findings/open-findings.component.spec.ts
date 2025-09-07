import { QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FindingGraphsStoreService } from '@customer-portal/data-access/findings';
import {
  ChartComponent,
  createOrUpdateLegendForCharts,
} from '@customer-portal/shared';

import { createFindingsGraphStoreServiceMock } from '../../__mocks__/findings-graph-store.service.mock';
import { OpenFindingsComponent } from './open-findings.component';

jest.mock('@customer-portal/shared', () => ({
  ...jest.requireActual('@customer-portal/shared'),
  createOrUpdateLegendForCharts: jest.fn(),
}));

describe('OpenFindingsComponent', () => {
  let component: OpenFindingsComponent;
  const findingGraphsStoreServiceMock: Partial<FindingGraphsStoreService> =
    createFindingsGraphStoreServiceMock();

  beforeEach(async () => {
    jest.clearAllMocks();
    TestBed.runInInjectionContext(() => {
      component = new OpenFindingsComponent(
        findingGraphsStoreServiceMock as FindingGraphsStoreService,
      );
    });
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call loadOpenFindingsGraphData on ngOnInit', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      findingGraphsStoreServiceMock.loadOpenFindingsGraphData,
    ).toHaveBeenCalled();
  });

  test('should call createOrUpdateLegendForCharts with correct parameters on onLegendClick', () => {
    // Arrange
    const chartComponents = new QueryList<ChartComponent>();
    component.chartComponents = chartComponents;
    const helperSpy = createOrUpdateLegendForCharts as jest.Mock;

    // Act
    component.onLegendClick({} as MouseEvent);

    // Assert
    expect(helperSpy).toHaveBeenCalled();
  });

  test('should update legend in refreshLegend', () => {
    // Arrange
    const chartComponents = new QueryList<ChartComponent>();
    chartComponents.reset([{} as ChartComponent, {} as ChartComponent]);
    component.chartComponents = chartComponents;
    const helperSpy = createOrUpdateLegendForCharts as jest.Mock;

    // Act
    component['refreshLegend']();

    // Assert
    expect(helperSpy).toHaveBeenCalledWith(
      component.sharedLegendId,
      chartComponents.toArray(),
    );
  });

  test('should compute opendFindingsData correctly', () => {
    // Arrange
    const expectedComputedData = {
      overdueGraphData: {
        datasets: [],
        labels: [],
      },
      becomingOverdueGraphData: {
        datasets: [],
        labels: [],
      },
      inProgressGraphData: {
        datasets: [],
        labels: [],
      },
      earlyStageGraphData: {
        datasets: [],
        labels: [],
      },
    };

    // Act
    const computedData = component.openFindingsData();

    // Assert
    expect(computedData).toEqual(expectedComputedData);
  });

  test('should call resetFindingsGraphData on ngOnDestroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      findingGraphsStoreServiceMock.resetFindingsGraphData,
    ).toHaveBeenCalled();
  });
});
