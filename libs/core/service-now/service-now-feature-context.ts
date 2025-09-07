import { ServiceNowFeatureContext } from './service-now.models';
import { ServiceNowFeature } from './service-now.constants';

export const featureContexts: ServiceNowFeatureContext[] = [
  {
    feature: ServiceNowFeature.DNV_CERTIFICATE,
    static: {},
    params: {
      id: 'id',
      sys_id: 'sys_id',
      language: 'language',
      reportingCountry: 'reportingCountry',
      projectNumber: 'projectNumber',
      certificateNumber: 'certificateNumber',
      revisionNumber: 'revisionNumber',
      certificateID: 'certificateID',
      certificateStatus: 'certificateStatus',
      service: 'service',
    },
  },
  { 
    feature: ServiceNowFeature.DNV_INVOICE,
    static: {},
    params: {
      id: 'id',
      sys_id: 'sys_id',
      language: 'language',
      reportingCountry: 'reportingCountry',
      projectNumber: 'projectNumber',
      invoice: 'invoice',
      status: 'status',
    },
  },
  { 
    feature: ServiceNowFeature.DNV_SCHEDULE,
    static: {},
    params: {
      id: 'id',
      sys_id: 'sys_id',
      language: 'language',
      reportingCountry: 'reportingCountry',
      projectNumber: 'projectNumber',
      startDate: 'startDate',
      endDate: 'endDate',
      auditID: 'auditID',
      siteAuditor: 'siteAuditor',
      siteAddress: 'siteAddress',
      site: 'site',
      status: 'status',
      service: 'service',
      siteCity: 'siteCity',
      siteZip: 'siteZip',
      siteCountry: 'siteCountry',
      siteState: 'siteState',
    },
  },
];