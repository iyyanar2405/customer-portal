import {
  AuditChartsStoreService,
  AuditChartsTabs,
  createAuditChartsStoreServiceMock,
} from '@customer-portal/data-access/audit';

import { AuditChartsTabViewComponent } from './audit-charts-tab-view.component';

describe('AuditChartsTabViewComponent', () => {
  let component: AuditChartsTabViewComponent;

  const auditChartsStoreServiceMock: Partial<AuditChartsStoreService> =
    createAuditChartsStoreServiceMock();

  beforeEach(async () => {
    component = new AuditChartsTabViewComponent(
      auditChartsStoreServiceMock as AuditChartsStoreService,
    );
  });

  test('it should have AuditChartsTabs defined', () => {
    // Assert
    expect(component.AuditChartsTabs).toBeDefined();
  });

  test('it should set the initial activeTab to AuditChartsTabs.AuditStatus', () => {
    // Assert
    expect(component.activeTab).toBe(AuditChartsTabs.AuditStatus);
  });

  test('it should call setActiveFindingsTab with the correct tab on tab change and emit tabChange output with true value', () => {
    // Arrange
    const tabChangeEvent = { index: 1 } as any;
    jest.spyOn(component.tabChange, 'emit');

    // Act
    component.onTabChange(tabChangeEvent);

    // Assert
    expect(component.activeTab).toBe(AuditChartsTabs.AuditDays);
    expect(auditChartsStoreServiceMock.setActiveAuditsTab).toHaveBeenCalledWith(
      AuditChartsTabs.AuditDays,
    );
    expect(component.tabChange.emit).toHaveBeenCalledWith(true);
  });

  test('should correctly map tab indices to AuditChartsTabs', () => {
    // Arrange
    const tabIndicesToTabs = [
      AuditChartsTabs.AuditStatus,
      AuditChartsTabs.AuditDays,
    ];

    tabIndicesToTabs.forEach((expectedTab, index) => {
      // Act
      component.onTabChange({ index } as any);

      // Assert
      expect(component.activeTab).toBe(expectedTab);
    });
  });
});
