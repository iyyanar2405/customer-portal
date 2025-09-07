import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import {
  AuditDaysGridService,
  AuditDetailsState,
  AuditGraphsState,
  AuditListState,
} from '@customer-portal/data-access/audit';
import { Language } from '@customer-portal/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const AUDIT_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/audit/audit.component').then(
        (m) => m.AuditComponent,
      ),
    providers: [
      provideTranslocoScope({
        scope: 'audit',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([AuditListState])),
    ],
    title: 'Audit Overview',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./lib/components/audit-list/audit-list.component').then(
            (m) => m.AuditListComponent,
          ),
        title: 'Audit List',
      },
      {
        path: 'graphs',
        loadComponent: () =>
          import('./lib/components/audit-charts/audit-charts.component').then(
            (m) => m.AuditChartsComponent,
          ),
        providers: [
          AuditDaysGridService,
          importProvidersFrom(NgxsModule.forFeature([AuditGraphsState])),
        ],
        title: 'Audit Graphs',
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
    path: ':auditId',
    loadComponent: () =>
      import('./lib/components/audit-details/audit-details.component').then(
        (m) => m.AuditDetailsComponent,
      ),
    providers: [
      provideTranslocoScope({
        scope: 'audit',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([AuditDetailsState])),
    ],
    title: 'Audit Details',
    data: {
      breadcrumb: null,
    },
  },
];
