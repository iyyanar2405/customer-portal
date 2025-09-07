import {
  CertificateGraphsStoreService,
  createCertificateGraphStoreServiceMock,
} from '@customer-portal/data-access/certificates';

import { CertificateStatusComponent } from './certificate-status.component';

describe('CertificateStatusComponent', () => {
  let component: CertificateStatusComponent;

  const certificatesGraphsStoreServiceMock: Partial<CertificateGraphsStoreService> =
    createCertificateGraphStoreServiceMock();

  beforeEach(async () => {
    component = new CertificateStatusComponent(
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
