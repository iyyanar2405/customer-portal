import { FindingGraphsStoreService } from '@customer-portal/data-access/findings';

import { createFindingsGraphStoreServiceMock } from '../../__mocks__/findings-graph-store.service.mock';
import { FindingStatusComponent } from './finding-status.component';

describe('FindingGraphsComponent', () => {
  let component: FindingStatusComponent;

  const findingGraphsStoreServiceMock: Partial<FindingGraphsStoreService> =
    createFindingsGraphStoreServiceMock();

  beforeEach(async () => {
    component = new FindingStatusComponent(
      findingGraphsStoreServiceMock as FindingGraphsStoreService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call loadFindingStatusByCategoryGraphData and loadFindingsByStatusGraphsData on ngOnInit', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      findingGraphsStoreServiceMock.loadFindingStatusByCategoryGraphData,
    ).toHaveBeenCalled();
    expect(
      findingGraphsStoreServiceMock.loadFindingsByStatusGraphsData,
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
