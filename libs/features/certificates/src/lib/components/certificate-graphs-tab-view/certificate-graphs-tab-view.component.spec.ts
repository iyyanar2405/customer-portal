import {
  CertificateGraphsStoreService,
  CertificatesTabs,
  createCertificateGraphStoreServiceMock,
} from '@customer-portal/data-access/certificates';

import { CertificateGraphsTabViewComponent } from './certificate-graphs-tab-view.component';

describe('CertificatesGraphsTabViewComponent', () => {
  let component: CertificateGraphsTabViewComponent;

  const certificatesGraphsStoreServiceMock: Partial<CertificateGraphsStoreService> =
    createCertificateGraphStoreServiceMock();

  beforeEach(async () => {
    component = new CertificateGraphsTabViewComponent(
      certificatesGraphsStoreServiceMock as CertificateGraphsStoreService,
    );
  });

  test('it should have CertificatesTabs defined', () => {
    // Assert
    expect(component.CertificatesTabs).toBeDefined();
  });

  test('it should set the initial activeTab to CertificatesTabs.CertificatesStatus', () => {
    // Assert
    expect(component.activeTab).toBe(CertificatesTabs.CertificatesStatus);
  });

  test('it should call setActiveCertificatesTab with the correct tab on tab change', () => {
    // Arrange
    const tabChangeEvent = { index: 1 } as any;

    // Act
    component.onTabChange(tabChangeEvent);

    // Assert
    expect(component.activeTab).toBe(CertificatesTabs.CertificatesBySite);
    expect(
      certificatesGraphsStoreServiceMock.setActiveCertificatesTab,
    ).toHaveBeenCalledWith(CertificatesTabs.CertificatesBySite);
  });

  test('should correctly map tab indices to CertificatesTabs', () => {
    // Arrange
    const tabIndicesToTabs = [
      CertificatesTabs.CertificatesStatus,
      CertificatesTabs.CertificatesBySite,
    ];

    tabIndicesToTabs.forEach((expectedTab, index) => {
      // Act
      component.onTabChange({ index } as any);

      // Assert
      expect(component.activeTab).toBe(expectedTab);
    });
  });
});
