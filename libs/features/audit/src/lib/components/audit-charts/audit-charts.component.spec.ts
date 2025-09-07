import { WritableSignal } from '@angular/core';

import {
  AuditChartFilterKey,
  AuditChartFilterStoreService,
  AuditChartsStoreService,
  createAuditChartFilterStoreServiceMock,
  createAuditChartsStoreServiceMock,
} from '@customer-portal/data-access/audit';
import { getTimeRange, TimeRange } from '@customer-portal/shared';

import { AuditChartsComponent } from './audit-charts.component';

jest.mock('@customer-portal/shared', () => {
  const actual = jest.requireActual('@customer-portal/shared');

  return {
    ...actual,
    getTimeRange: jest.fn(),
  };
});

describe('AuditChartsComponent', () => {
  let component: AuditChartsComponent;
  const auditChartFilterStoreServiceMock: Partial<AuditChartFilterStoreService> =
    createAuditChartFilterStoreServiceMock();
  const auditChartsStoreServiceMock: Partial<AuditChartsStoreService> =
    createAuditChartsStoreServiceMock();

  beforeEach(async () => {
    component = new AuditChartsComponent(
      auditChartFilterStoreServiceMock as AuditChartFilterStoreService,
      auditChartsStoreServiceMock as AuditChartsStoreService,
    );
  });

  test('should call loadGraphsFilterList', () => {
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

  test('should call updateAuditChartFilterByKey and loadGraphsData on filter change', () => {
    // Arrange
    const mockData = ['Kuehne-Nagel Management AG'];
    const mockKey = AuditChartFilterKey.Companies;
    const updateAuditChartFilterByKeySpy = jest.spyOn(
      auditChartFilterStoreServiceMock,
      'updateAuditChartFilterByKey',
    );
    const loadAuditsGraphsDataSpy = jest.spyOn(
      auditChartsStoreServiceMock,
      'loadAuditsGraphsData',
    );

    // Act
    component.onFilterChange(mockData, mockKey);

    // Assert
    expect(updateAuditChartFilterByKeySpy).toHaveBeenCalledWith(
      mockData,
      mockKey,
    );
    expect(loadAuditsGraphsDataSpy).toHaveBeenCalled();
  });

  test('should resetAuditsGraphState on ngOnDestroy', () => {
    // Arrange
    const resetAuditGraphsStateSpy = jest.spyOn(
      auditChartsStoreServiceMock,
      'resetAuditsGraphState',
    );
    // Act
    component.ngOnDestroy();

    // Assert
    expect(resetAuditGraphsStateSpy).toHaveBeenCalled();
  });

  test('loadGraphsFilterList should update filter and load filter list', () => {
    // Arrange
    const updateAuditChartFilterByKeySpy = jest.spyOn(
      auditChartFilterStoreServiceMock,
      'updateAuditChartFilterByKey',
    );
    const loadAuditChartFilterListSpy = jest.spyOn(
      auditChartFilterStoreServiceMock,
      'loadAuditChartFilterList',
    );

    // Act
    component['loadGraphsFilterList']();

    // Assert
    expect(updateAuditChartFilterByKeySpy).toHaveBeenCalled();
    expect(loadAuditChartFilterListSpy).toHaveBeenCalled();
  });

  describe('onTabChange', () => {
    test('should set dateRangeIsDisabled to true when isAuditDaysTab is true', () => {
      // Arrange
      component.dateRangeIsDisabled = false;

      // Act
      component.onTabChange(true);

      // Assert
      expect(component.dateRangeIsDisabled).toBe(true);
    });

    test('should update the time range when switching from audit days tab to another tab', () => {
      // Arrange
      const dateRange = [
        new Date('2022-01-01T00:00:00Z'),
        new Date('2022-01-03T00:00:00Z'),
      ];

      const updateAuditChartFilterByKeySpy = jest.spyOn(
        auditChartFilterStoreServiceMock,
        'updateAuditChartFilterByKey',
      );

      (component as any).lastTimeRangeValue = dateRange;

      // Act
      component.onTabChange(false);

      // Assert
      expect(updateAuditChartFilterByKeySpy).toHaveBeenCalledWith(
        dateRange,
        AuditChartFilterKey.TimeRange,
      );
    });

    test('should update the time range with YearCurrent when switching to audit days tab', () => {
      // Arrange
      const dateRange = [
        new Date('2022-01-04T00:00:00Z'),
        new Date('2022-01-08T00:00:00Z'),
      ];
      (getTimeRange as jest.Mock).mockReturnValue(dateRange);
      (
        auditChartFilterStoreServiceMock.filterDateRange as WritableSignal<
          Date[]
        >
      ).set(dateRange);

      // Act
      component.onTabChange(true);

      // Assert
      expect(
        auditChartFilterStoreServiceMock.updateAuditChartFilterByKey,
      ).toHaveBeenCalledWith(dateRange, AuditChartFilterKey.TimeRange);
      expect((component as any).lastTimeRangeValue).toEqual(dateRange);
      expect(component.selectedTimeRange()).toBe(TimeRange.YearCurrent);
    });

    test('should reset lastTimeRangeValue to an empty array when switching away from audit days tab', () => {
      // Arrange
      (component as any).lastTimeRangeValue = [
        new Date('2022-01-04T00:00:00Z'),
        new Date('2022-01-08T00:00:00Z'),
      ];

      // Act
      component.onTabChange(false);

      // Assert
      expect((component as any).lastTimeRangeValue).toEqual([]);
    });
  });
});
