import { Signal } from '@angular/core';
import { of } from 'rxjs';

import {
  FindingChartFilterKey,
  FindingChartFilterStoreService,
  FindingGraphsStoreService,
} from '@customer-portal/data-access/findings';

import { FindingChartComponent } from './finding-chart.component';

describe('FindingChartComponent', () => {
  let component: FindingChartComponent;
  const findingChartFilterStoreServiceMock: Partial<FindingChartFilterStoreService> =
    {
      updateFindingChartFilterByKey: jest.fn(),
      loadFindingChartFilterList: jest.fn().mockReturnValue(of([])),
      filterDateRange: Object.assign(() => [], {
        [Symbol('SIGNAL')]: true,
      }) as unknown as Signal<Date[]>,
    };
  const findingGraphsStoreServiceMock: Partial<FindingGraphsStoreService> = {
    loadFindingsGraphsData: jest.fn(),
    resetFindingsGraphsState: jest.fn(),
  };

  beforeEach(async () => {
    component = new FindingChartComponent(
      findingChartFilterStoreServiceMock as FindingChartFilterStoreService,
      findingGraphsStoreServiceMock as FindingGraphsStoreService,
    );
  });

  test('should initialize and load graphs filter list on init', () => {
    // Arrange
    const loadGraphsFilterListSpy = jest.spyOn(
      component as any,
      'loadGraphsFilterList',
    );

    // Act
    component.ngOnInit();

    // Assert
    expect(loadGraphsFilterListSpy).toHaveBeenCalled();
  });

  test('should update filter and load graphs data on filter change', () => {
    // Arrange
    const mockData = ['Kuehne-Nagel Management AG'];
    const mockKey = FindingChartFilterKey.Companies;
    const updateFindingChartFilterByKeySpy = jest.spyOn(
      findingChartFilterStoreServiceMock,
      'updateFindingChartFilterByKey',
    );
    const loadFindingsGraphsDataSpy = jest.spyOn(
      findingGraphsStoreServiceMock,
      'loadFindingsGraphsData',
    );

    // Act
    component.onFilterChange(mockData, mockKey);

    // Assert
    expect(updateFindingChartFilterByKeySpy).toHaveBeenCalledWith(
      mockData,
      mockKey,
    );
    expect(loadFindingsGraphsDataSpy).toHaveBeenCalled();
  });

  test('should disable date range filter', () => {
    component.onDisableFilterEvent(true);
    expect(component.dateRangeIsDisabled).toBe(true);
  });

  test('should reset findings graphs state on destroy', () => {
    // Arrange
    const onDestroyResetSpy = jest.spyOn(
      findingGraphsStoreServiceMock,
      'resetFindingsGraphsState',
    );

    // Act
    component.ngOnDestroy();

    // Assert
    expect(onDestroyResetSpy).toHaveBeenCalled();
  });

  test('should load graphs filter list', () => {
    // Arrange
    const updateFindingChartFilterByKeySpy = jest.spyOn(
      findingChartFilterStoreServiceMock,
      'updateFindingChartFilterByKey',
    );
    const loadFindingsGraphsDataSpy = jest.spyOn(
      findingGraphsStoreServiceMock,
      'loadFindingsGraphsData',
    );

    // Act
    component['loadGraphsFilterList']();

    // Assert
    expect(updateFindingChartFilterByKeySpy).toHaveBeenCalled();
    expect(loadFindingsGraphsDataSpy).toHaveBeenCalled();
  });
});
