import { FindingGraphsStoreService } from '@customer-portal/data-access/findings';

import { createFindingsGraphStoreServiceMock } from '../../__mocks__/findings-graph-store.service.mock';
import { FindingTrendsGraphComponent } from './finding-trends-graph.component';

describe('FindingTrendsGraphComponent', () => {
  let component: FindingTrendsGraphComponent;
  const findingGraphsStoreServiceMock: Partial<FindingGraphsStoreService> =
    createFindingsGraphStoreServiceMock();

  beforeEach(async () => {
    component = new FindingTrendsGraphComponent(
      findingGraphsStoreServiceMock as FindingGraphsStoreService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call loadFindingsByCategoryGraphData and loadFindingsDataTrends on ngOnInit', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      findingGraphsStoreServiceMock.loadFindingsByCategoryGraphData,
    ).toHaveBeenCalled();
    expect(
      findingGraphsStoreServiceMock.loadFindingsByCategoryGraphData,
    ).toHaveBeenCalled();
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
