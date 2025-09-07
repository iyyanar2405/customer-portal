import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import {
  CertificateDetailsState,
  CertificateGraphsState,
  CertificateListState,
} from '@customer-portal/data-access/certificates';
import { Language } from '@customer-portal/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const CERTIFICATES_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/certificate/certificate.component').then(
        (m) => m.CertificateComponent,
      ),
    providers: [
      provideTranslocoScope({
        scope: 'certificate',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([CertificateListState])),
    ],
    title: 'Certificates Overview',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './lib/components/certificate-list/certificate-list.component'
          ).then((m) => m.CertificateListComponent),
        title: 'Certificate List',
      },
      {
        path: 'graphs',
        loadComponent: () =>
          import(
            './lib/components/certificate-chart/certificate-chart.component'
          ).then((m) => m.CertificateChartComponent),
        providers: [
          importProvidersFrom(NgxsModule.forFeature([CertificateGraphsState])),
        ],
        title: 'Certificate Graphs',
        data: {
          breadcrumb: {
            i18nKey: 'breadcrumb.graphs',
            isHidden: true,
          },
        },
      },
    ],
  },
  {
    path: ':certificateId',
    loadComponent: () =>
      import(
        './lib/components/certificate-details/certificate-details.component'
      ).then((m) => m.CertificateDetailsComponent),
    providers: [
      provideTranslocoScope({
        scope: 'certificate',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([CertificateDetailsState])),
    ],
    title: 'Certificate Details',
    data: {
      breadcrumb: null,
    },
  },
];
