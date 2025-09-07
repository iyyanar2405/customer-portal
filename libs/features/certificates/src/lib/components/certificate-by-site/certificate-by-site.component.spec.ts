import {
  CertificateGraphsStoreService,
  createCertificateGraphStoreServiceMock,
} from '@customer-portal/data-access/certificates';

import { CertificateBySiteComponent } from './certificate-by-site.component';

describe('CertificateBySiteComponent', () => {
  let component: CertificateBySiteComponent;

  const certificatesGraphsStoreServiceMock: Partial<CertificateGraphsStoreService> =
    createCertificateGraphStoreServiceMock();

  beforeEach(async () => {
    component = new CertificateBySiteComponent(
      certificatesGraphsStoreServiceMock as CertificateGraphsStoreService,
    );
  });
  test('should call loadCertificatesGraphsData on ngOnInit', () => {
    // Arrange
    const loadCertificatesGraphsDataSpy = jest.spyOn(
      certificatesGraphsStoreServiceMock,
      'loadCertificatesGraphsData',
    );

    // Act
    component.ngOnInit();

    // Assert
    expect(loadCertificatesGraphsDataSpy).toHaveBeenCalled();
  });

  test('should call resetCertificatesGraphData on ngOnDestroy', () => {
    // Arrange
    const resetCertificatesGraphDataSpy = jest.spyOn(
      certificatesGraphsStoreServiceMock,
      'resetCertificatesGraphData',
    );

    // Act
    component.ngOnDestroy();

    // Assert
    expect(resetCertificatesGraphDataSpy).toHaveBeenCalled();
  });
});
