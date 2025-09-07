import { ServiceNowFeature } from './service-now.constants';

export interface BaseServiceNowParams {
  language: string;
  reportingCountry: string;
  projectNumber: string;
}

export interface CertificateParams extends BaseServiceNowParams {
  certificateNumber: string;
  revisionNumber: number;
  certificateID: number;
  certificateStatus: string;
  service: string;
}

export interface InvoiceParams extends BaseServiceNowParams {
  invoice: string;
  status: string;
}

export interface ScheduleParams extends BaseServiceNowParams {
  startDate: string;
  endDate: string;
  auditID: number;
  siteAuditor: number;
  site: string;
  status: string;
  siteAddress: string;
  siteCity: string;
  siteZip: number;
  siteCountry: string;
  siteState: string;
}

export interface CompanySettingsParams extends BaseServiceNowParams {
  accountID: number;
  accountName: string;
}

export interface ServiceNowClient {
  init: (config: ServiceNowConfig) => void;
  open: () => void;
  close: () => void;
  destroy: () => void;
  loadEMFeature: () => void;
  addNewFeatureContext: (featureContext: ServiceNowFeatureContext) => void;
}

export interface ServiceNowConfig {
  moduleID: string;
  loadFeature: ServiceNowFeatureLoadOptions;
}

export interface ServiceNowFeatureContext {
  feature: ServiceNowFeature;
  static: Record<string, string>;
  params: Record<string, string>;
}

export interface ServiceNowFeatureLoadOptions {
  feature: ServiceNowFeature;
  openOnLoad: boolean;
  params?: Record<string, string> | BaseServiceNowParams;
}