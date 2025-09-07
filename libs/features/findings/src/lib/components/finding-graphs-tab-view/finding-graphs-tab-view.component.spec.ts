import {
  FindingGraphsStoreService,
  FindingTabs,
} from '@customer-portal/data-access/findings';

import { createFindingsGraphStoreServiceMock } from '../../__mocks__/findings-graph-store.service.mock';
import { FindingGraphsTabViewComponent } from './finding-graphs-tab-view.component';

describe('FindingGraphsTabViewComponent', () => {
  let component: FindingGraphsTabViewComponent;

  const findingGraphsStoreServiceMock: Partial<FindingGraphsStoreService> =
    createFindingsGraphStoreServiceMock();

  beforeEach(async () => {
    component = new FindingGraphsTabViewComponent(
      findingGraphsStoreServiceMock as FindingGraphsStoreService,
    );
  });

  test('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('it should have FindingTabs defined', () => {
    // Assert
    expect(component.FindingTabs).toBeDefined();
  });

  test('it should set the initial activeTab to FindingTabs.FindingStatus', () => {
    // Assert
    expect(component.activeTab).toBe(FindingTabs.FindingStatus);
  });

  test('it should call setActiveFindingsTab with the correct tab on tab change', () => {
    // Arrange
    const tabChangeEvent = { index: 1 } as any;

    // Act
    component.onTabChange(tabChangeEvent);

    // Assert
    expect(component.activeTab).toBe(FindingTabs.OpenFindings);
    expect(
      findingGraphsStoreServiceMock.setActiveFindingsTab,
    ).toHaveBeenCalledWith(FindingTabs.OpenFindings);
  });

  test('should correctly map tab indices to FindingTabs', () => {
    // Arrange
    const tabIndicesToTabs = [
      FindingTabs.FindingStatus,
      FindingTabs.OpenFindings,
      FindingTabs.FindingsByClause,
      FindingTabs.FindingsBySite,
      FindingTabs.Trends,
    ];

    tabIndicesToTabs.forEach((expectedTab, index) => {
      // Act
      component.onTabChange({ index } as any);

      // Assert
      expect(component.activeTab).toBe(expectedTab);
    });
  });
});
