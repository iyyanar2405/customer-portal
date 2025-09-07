import {
  CertificateChartFilterKey,
  CertificateChartFilterStoreService,
  CertificateGraphsStoreService,
  createCertificateChartFilterStoreServiceMock,
  createCertificateGraphStoreServiceMock,
} from '@customer-portal/data-access/certificates';

import { CertificateChartComponent } from './certificate-chart.component';

describe('CertificateChartComponent', () => {
  let component: CertificateChartComponent;
  const certificateChartFilterStoreServiceMock: Partial<CertificateChartFilterStoreService> =
    createCertificateChartFilterStoreServiceMock();
  const certificateGraphsStoreServiceMock: Partial<CertificateGraphsStoreService> =
    createCertificateGraphStoreServiceMock();

  beforeEach(async () => {
    component = new CertificateChartComponent(
      certificateChartFilterStoreServiceMock as CertificateChartFilterStoreService,
      certificateGraphsStoreServiceMock as CertificateGraphsStoreService,
    );
  });

  test('should call loadGraphsFilterList on ngOnInit', () => {
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

  test('should call updateCertificateChartFilterByKey and loadCertificatesGraphsData on filter change', () => {
    // Arrange
    const mockData = ['Kuehne-Nagel Management AG'];
    const mockKey = CertificateChartFilterKey.Companies;
    const updateCertificateChartFilterByKeySpy = jest.spyOn(
      certificateChartFilterStoreServiceMock,
      'updateCertificateChartFilterByKey',
    );
    const loadCertificatesByStatusGraphsDataSpy = jest.spyOn(
      certificateGraphsStoreServiceMock,
      'loadCertificatesGraphsData',
    );

    // Act
    component.onFilterChange(mockData, mockKey);

    // Assert
    expect(updateCertificateChartFilterByKeySpy).toHaveBeenCalledWith(
      mockData,
      mockKey,
    );
    expect(loadCertificatesByStatusGraphsDataSpy).toHaveBeenCalled();
  });

  test('should resetCertificateGraphsState on ngOnDestroy', () => {
    // Arrange
    const resetCertificateGraphsStateSpy = jest.spyOn(
      certificateGraphsStoreServiceMock,
      'resetCertificateGraphsState',
    );
    // Act
    component.ngOnDestroy();

    // Assert
    expect(resetCertificateGraphsStateSpy).toHaveBeenCalled();
  });

  test('loadGraphsFilterList should update filter and load filter list', () => {
    // Arrange
    const updateCertificateChartFilterByKeySpy = jest.spyOn(
      certificateChartFilterStoreServiceMock,
      'updateCertificateChartFilterByKey',
    );
    const loadCertificateChartFilterListSpy = jest.spyOn(
      certificateChartFilterStoreServiceMock,
      'loadCertificateChartFilterList',
    );

    // Act
    component['loadGraphsFilterList']();

    // Assert
    expect(updateCertificateChartFilterByKeySpy).toHaveBeenCalled();
    expect(loadCertificateChartFilterListSpy).toHaveBeenCalled();
  });
});
