import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import { AuditListState } from '@customer-portal/data-access/audit';
import { FindingsListState } from '@customer-portal/data-access/findings';
import {
  OverviewFinancialStatusState,
  OverviewState,
  OverviewStoreService,
  OverviewUpcomingAuditsState,
  TrainingStatusState,
} from '@customer-portal/data-access/overview';
import { ScheduleListState } from '@customer-portal/data-access/schedules';
import { Language } from '@customer-portal/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const OVERVIEW_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/overview/overview.component').then(
        (m) => m.OverviewComponent,
      ),
    data: {
      breadcrumb: null,
    },
    title: 'Overview',
    providers: [
      OverviewStoreService,
      provideTranslocoScope({
        scope: 'overview',
        loader,
      }),
      importProvidersFrom(
        NgxsModule.forFeature([
          OverviewState,
          TrainingStatusState,
          OverviewFinancialStatusState,
          AuditListState,
          FindingsListState,
          ScheduleListState,
        ]),
      ),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './lib/components/overview-upcoming-audits/overview-upcoming-audits.component'
          ).then((m) => m.OverviewUpcomingAuditsComponent),
        title: 'Overview Upcoming Audits',
        providers: [
          importProvidersFrom(
            NgxsModule.forFeature([OverviewUpcomingAuditsState]),
          ),
        ],
      },
    ],
  },
];
