import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    output,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';

import { LoggingService, ServiceNowService } from '@customer-portal/core';
import { UnreadActionsStoreService } from '@customer-portal/data-access/actions';
import { UnreadNotificationsStoreService } from '@customer-portal/data-access/notifications';
import {
    CoBrowsingSharedService,
    getToastContentBySeverity,
    ToastSeverity,
} from '@customer-portal/shared';

import { NavbarButtonComponent } from '../navbar-button';
import { NavbarSettingsComponent } from '../navbar-settings';

@Component({
    selector: 'customer-portal-navbar',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoDirective,
        NavbarButtonComponent,
        NavbarSettingsComponent,
    ],
    providers: [UnreadNotificationsStoreService, UnreadActionsStoreService],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
    public toggleSidebarEvent = output<boolean>();
    serviceNowService = inject(ServiceNowService);
    messageService = inject(MessageService);
    loggingService = inject(LoggingService);

    constructor(
        private readonly router: Router,
        public unreadNotificationsStoreService: UnreadNotificationsStoreService,
        public unreadActionsStoreService: UnreadActionsStoreService,
        private ts: TranslocoService,
        public readonly coBrowsingSharedService: CoBrowsingSharedService,
    ) {}

    ngOnInit(): void {
        this.unreadNotificationsStoreService.loadUnreadNotifications();
        this.unreadActionsStoreService.loadUnreadActions();
    }

    onToggleSidebar(value: boolean): void {
        this.toggleSidebarEvent.emit(value);
    }

    onNavigateTo(route: string): void {
        this.router.navigate([`/${route}`]);
    }

    onActionClick(route: string): void {
        this.router.navigate([`/${route}`]);
    }

    openServiceNowGeneralHelp(): void {
        try {
            this.serviceNowService.openCatalogItemSupport();
        } catch (error) {
            const message = getToastContentBySeverity(ToastSeverity.Error);
            message.summary = this.ts.translate('serviceNow.error');
            this.messageService.add(message);

            this.loggingService.logException(
                error instanceof Error ? error : new Error(String(error)),
            );
        }
    }
}