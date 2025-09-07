import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import { UnreadActionsStoreService } from '@customer-portal/data-access/actions';
import {
  FindingDetailsState,
  FindingGraphsState,
  FindingsListState,
} from '@customer-portal/data-access/findings';
import { Language } from '@customer-portal/shared';

import { findingDetailsDeactivationGuard } from './lib/guards';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const FINDINGS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/finding/finding.component').then(
        (m) => m.FindingComponent,
      ),
    providers: [
      provideTranslocoScope({
        scope: 'findings',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([FindingsListState])),
    ],
    title: 'Findings Overview',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./lib/components/finding-list/finding-list.component').then(
            (m) => m.FindingListComponent,
          ),
        title: 'Finding List',
      },
      {
        path: 'graphs',
        loadComponent: () =>
          import('./lib/components/finding-chart/finding-chart.component').then(
            (m) => m.FindingChartComponent,
          ),
        providers: [
          importProvidersFrom(NgxsModule.forFeature([FindingGraphsState])),
        ],
        title: 'Finding Graphs',
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
    path: ':findingId',
    loadComponent: () =>
      import('./lib/components/finding-details/finding-details.component').then(
        (m) => m.FindingDetailsComponent,
      ),
    providers: [
      UnreadActionsStoreService,
      importProvidersFrom(NgxsModule.forFeature([FindingDetailsState])),
      provideTranslocoScope({
        scope: 'findings',
        loader,
      }),
    ],
    title: 'Finding Details',
    data: {
      breadcrumb: null,
    },
    canDeactivate: [findingDetailsDeactivationGuard],
  },
];
