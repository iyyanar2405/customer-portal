import { OverviewFilterStoreService } from '@customer-portal/data-access/overview';
import { createOverviewFiltersStoreServiceMock } from '@customer-portal/data-access/settings';

import { OverviewFiltersComponent } from './overview-filters.component';

describe('OverviewFiltersComponent', () => {
  let component: OverviewFiltersComponent;
  let mockOverviewFilterStoreService: Partial<OverviewFilterStoreService>;

  beforeEach(() => {
    mockOverviewFilterStoreService = createOverviewFiltersStoreServiceMock();

    component = new OverviewFiltersComponent(
      mockOverviewFilterStoreService as OverviewFilterStoreService,
    );
  });

  test('should create the component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should call loadOverviewFilterList on init', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      mockOverviewFilterStoreService.loadOverviewFilterList,
    ).toHaveBeenCalled();
  });

  test('should call updateOverviewFilterByKey when filter changes', () => {
    // Arrange
    const mockData = { id: 1 };
    const mockKey = 'companies';

    // Act
    component.onFilterChange(mockData, mockKey);

    // Assert
    expect(
      mockOverviewFilterStoreService.updateOverviewFilterByKey,
    ).toHaveBeenCalledWith(mockData, mockKey);
  });
});
