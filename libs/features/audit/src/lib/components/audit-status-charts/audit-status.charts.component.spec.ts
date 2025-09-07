import {
  AuditChartsStoreService,
  createAuditChartsStoreServiceMock,
} from '@customer-portal/data-access/audit';

import { AuditStatusChartsComponent } from './audit-status-charts.component';

describe('AuditStatusChartsComponent', () => {
  let component: AuditStatusChartsComponent;
  const auditChartsStoreServiceMock: Partial<AuditChartsStoreService> =
    createAuditChartsStoreServiceMock();

  beforeEach(async () => {
    component = new AuditStatusChartsComponent(
      auditChartsStoreServiceMock as AuditChartsStoreService,
    );
  });

  test('should call loadAuditStatusDoughnutGraphData and loadAuditStatusBarGraphData on ngOnInit', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      auditChartsStoreServiceMock.loadAuditStatusDoughnutGraphData,
    ).toHaveBeenCalled();
    expect(
      auditChartsStoreServiceMock.loadAuditStatusBarGraphData,
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
});
