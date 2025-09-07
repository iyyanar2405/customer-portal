import {
  AuditChartsStoreService,
  createAuditChartsStoreServiceMock,
} from '@customer-portal/data-access/audit';
import { ChartTypeEnum } from '@customer-portal/shared';

import { AuditDaysChartsComponent } from './audit-days-charts.component';

describe('AuditDaysChartsComponent', () => {
  let component: AuditDaysChartsComponent;
  const auditChartsStoreServiceMock: Partial<AuditChartsStoreService> =
    createAuditChartsStoreServiceMock();

  beforeEach(async () => {
    component = new AuditDaysChartsComponent(
      auditChartsStoreServiceMock as AuditChartsStoreService,
    );
  });

  test('should call loadAuditDaysDoughnutGraphData and loadAuditDaysBarGraphData on ngOnInit', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      auditChartsStoreServiceMock.loadAuditDaysDoughnutGraphData,
    ).toHaveBeenCalled();
    expect(
      auditChartsStoreServiceMock.loadAuditDaysBarGraphData,
    ).toHaveBeenCalled();
  });

  test('should call resetAuditsGraphsData on ngOnDestroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      auditChartsStoreServiceMock.resetAuditsGraphsData,
    ).toHaveBeenCalled();
  });

  describe('onTooltipButtonClick', () => {
    beforeEach(() => {
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => new Date(2025, 0, 1).getTime());
    });
    test('should transform month into start and end dates and call navigateFromChartToListView for Bar chart', () => {
      // Arrange
      const testEvent = [
        { label: 'Filter 1', value: ['A'] },
        { label: 'Month', value: [{ value: 'January' }] },
      ];

      const expectedTransformedEvent = [
        { label: 'Filter 1', value: ['A'] },
        {
          label: 'startDate',
          value: [
            { label: '01-01-2025', value: '01-01-2025' },
            { label: '31-01-2025', value: '31-01-2025' },
          ],
        },
      ];

      // Act
      component.onTooltipButtonClick(testEvent, ChartTypeEnum.Bar);

      // Assert
      expect(
        auditChartsStoreServiceMock.navigateFromChartToListView,
      ).toHaveBeenCalledWith(expectedTransformedEvent);
    });

    test('should call navigateFromChartToListView with unmodified event if chartType is not Bar', () => {
      // Arrange
      const testEvent = [{ label: 'Filter 1', value: ['A'] }];

      // Act
      component.onTooltipButtonClick(testEvent, ChartTypeEnum.Doughnut);

      // Assert
      expect(
        auditChartsStoreServiceMock.navigateFromChartToListView,
      ).toHaveBeenCalledWith(testEvent);
    });
  });
});
