import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  CSP_NONCE,
  ErrorHandler,
  importProvidersFrom,
  isDevMode,
  LOCALE_ID,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { provideTransloco } from '@jsverse/transloco';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import {
  NgxsRouterPluginModule,
  RouterStateSerializer,
} from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import {
  LoggingService,
  spinnerInterceptor,
  SpinnerService,
} from '@customer-portal/core';
import { UnreadActionsState } from '@customer-portal/data-access/actions';
import { DocumentsState } from '@customer-portal/data-access/documents';
import { UnreadNotificationsState } from '@customer-portal/data-access/notifications';
import { SettingsState } from '@customer-portal/data-access/settings';
import { environment } from '@customer-portal/environments';
import { OverviewSharedState } from '@customer-portal/overview-shared';
import { appInitializer } from '@customer-portal/permissions';
import { PreferencesState } from '@customer-portal/preferences';
import { CustomRouterStateSerializer } from '@customer-portal/router';
import {
  Language,
  LocaleService,
  registerLocales,
} from '@customer-portal/shared';

import { appRoutes } from './app.routes';
import {
  customHeaderInterceptor,
  errorInterceptor,
  GlobalErrorHandler,
} from './interceptors';
import { TranslocoHttpLoader } from './transloco-http.loader';

declare global {
  var dnvRandomNonce: string;
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const loggingService = new LoggingService();
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      loggingService.logTrace(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    loggingService.logTrace(`[Network error]: ${networkError}`);
  }
});

registerLocales();

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        customHeaderInterceptor,
        errorInterceptor,
        spinnerInterceptor,
      ])
    ),
    provideRouter(appRoutes, withDisabledInitialNavigation()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: DialogService },
    provideAnimations(),
    importProvidersFrom(
      NgxsModule.forRoot(
        [
          UnreadActionsState,
          DocumentsState,
          PreferencesState,
          SettingsState,
          OverviewSharedState,
          UnreadNotificationsState,
        ],
        {
          developmentMode: !environment.production,
          compatibility: {
            strictContentSecurityPolicy: true,
          },
        }
      ),
      NgxsDispatchPluginModule.forRoot(),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsRouterPluginModule.forRoot()
    ),
    {
      provide: CSP_NONCE,
      useValue: globalThis.dnvRandomNonce,
    },
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    {
      provide: LOCALE_ID,
      useFactory: (localeService: LocaleService): string =>
        localeService.getLocale(),
      deps: [LocaleService],
    },
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          audit: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                url: environment.auditGraphqlHost,
                withCredentials: true,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          finding: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                url: environment.findingsGraphqlHost,
                withCredentials: true,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          certificate: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                url: environment.certificateGraphqlHost,
                withCredentials: true,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          schedule: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                url: environment.scheduleGraphqlHost,
                withCredentials: true,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          invoice: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                url: environment.invoicesGraphqlHost,
                withCredentials: true,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          contact: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                url: environment.contactGraphqlHost,
                withCredentials: true,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          notification: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                url: environment.notificationGraphqlHost,
                withCredentials: true,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
        };
      },
      deps: [HttpLink],
    },
    provideTransloco({
      config: {
        availableLangs: [Language.English, Language.Italian],
        defaultLang: Language.English,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    Apollo,
    SpinnerService,
    MessageService,
  ],
};