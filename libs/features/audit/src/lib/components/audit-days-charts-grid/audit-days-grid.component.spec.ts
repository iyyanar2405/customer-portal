import { TranslocoService } from '@jsverse/transloco';

import {
  AuditChartsStoreService,
  AuditDaysNode,
  createAuditChartsStoreServiceMock,
} from '@customer-portal/data-access/audit';
import { createTranslationServiceMock } from '@customer-portal/shared';

import { AuditDaysGridComponent } from './audit-days-grid.component';

describe('AuditDaysGridComponent', () => {
  let component: AuditDaysGridComponent;

  const auditChartsStoreServiceMock: Partial<AuditChartsStoreService> =
    createAuditChartsStoreServiceMock();

  const mockTranslocoService: Partial<TranslocoService> =
    createTranslationServiceMock();

  beforeEach(async () => {
    component = new AuditDaysGridComponent(
      auditChartsStoreServiceMock as AuditChartsStoreService,
      mockTranslocoService as TranslocoService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should load audit graph data when component is initialized', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(auditChartsStoreServiceMock.loadAuditsGraphsData).toHaveBeenCalled();
  });

  test('should call navigateFromTreeToListView when onRowClicked is triggered', () => {
    // Arrange
    const rowData: AuditDaysNode = {
      dataType: 'Type1',
      location: 'Location1',
      auditDays: 30,
    };

    // Act
    component.onRowClicked(rowData);

    // Assert
    expect(
      auditChartsStoreServiceMock.navigateFromTreeToListView,
    ).toHaveBeenCalledWith({
      label: 'Type1',
      value: 'Location1',
    });
  });

  test('should reset audit graphs data state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      auditChartsStoreServiceMock.resetAuditsGraphsData,
    ).toHaveBeenCalled();
  });
});
