// environment.ts
import { EnvironmentModel } from './environment.model';

export const environment: EnvironmentModel = {
  api: 'http://localhost:3000/',
  apiKey: '5fa53d56bd846eb95228f23edf1a7',
  appInsights: {
    instrumentationKey: '56af6e4c-86f3-4f56-ab96-4bf565fa30ae',
  },
  authApiUrl: 'https://sccp-auth.dnv.com/Auth',
  baseUrl: 'http://localhost:4200',
  certificateGraphqlHost: 'https://testapi.dnv.com/ba-scecp-r2-certificateservice-dev',
  contactGraphqlHost: 'https://testapi.dnv.com/ba-scecp-r2-contactservice-dev',
  dnvLink: 'https://testapi.dnv.com/ba-scecp-r2-dev/v1/api/Documents',
  documentsApi: 'https://testapi.dnv.com/ba-scecp-services-r2-dev/v1/api/Documents',
  federatedLogoutUrl: 'https://veracity.com/logout',
  findingGraphqlHost: 'https://testapi.dnv.com/ba-scecp-r2-findingservice-dev',
  invoicesGraphqlHost: 'https://testapi.dnv.com/ba-scecp-financialservice-dev',
  auditGraphqlHost: 'https://testapi.dnv.com/ba-scecp-r2-auditservice-dev',
  powerBi: {
    accessToken: '',
    embedUrl: '',
    reportId: '4e19ccf9-1ff9-4a04-bd2d-1bab9cb1c029',
  },
  production: false,
  scheduleGraphqlHost: 'https://testapi.dnv.com/ba-scecp-r2-scheduleservice-dev',
  veracityUrl: 'https://id.veracity.com',
  notificationGraphqlHost: 'https://testapi.dnv.com/ba-scecp-notificationservice-dev',
  lmsUrl: 'https://learningdev.seertechsolutions.com.au/auth/oauth2/authorization/veracity',
  serviceNow: {
    moduleId: 'moduleId1',
    scriptUrl: 'https://customerservice-dev.dnv.com/scripts/sn_csm_sc.js?v=5.6',
    sysIds: {
      catalogItem: '628b6c5db34a6501cfcd2c5e4e45af5',
      dnvInvoice: '458b6b73b34aa101cfcd2c5e4e45af8',
      dnvSchedule: 'd216bef33b34aa101cfcd2c5e4e45aa',
      dnvCertificate: '47f372733b34aa101cfcd2c5e4e45a65',
      dnvCompanySettings: 'aaal234',
    },
  },
};
