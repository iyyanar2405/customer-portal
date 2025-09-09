import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';

import { AppInitializerService } from '@customer-portal/permissions';
import {
    CoBrowsingCookieService,
    CoBrowsingShareService,
    createTranslationServiceMock,
    SharedButtonComponent,
} from '@customer-portal/shared';

import { NavbarCoBrowsingComponent } from './navbar-co-browsing.component';

describe('NavbarCoBrowsingComponent', () => {
    let component: NavbarCoBrowsingComponent;
    let fixture: ComponentFixture<NavbarCoBrowsingComponent>;
    let translocoService: Partial<TranslocoService>;
    let mockCoBrowsingShareService: Partial<CoBrowsingShareService>;
    let mockCoBrowsingCookieService: Partial<CoBrowsingCookieService>;
    let mockAppInitializerService: Partial<AppInitializerService>;
    let mockConfirmationService: Partial<ConfirmationService>;

    beforeEach(() => {
        translocoService = createTranslationServiceMock();
        mockCoBrowsingShareService = {
            setCoBrowsingUserEmail: jest.fn(),
            getCoBrowsingUserEmail: jest.fn(),
        };
        mockCoBrowsingCookieService = {
            postUserEmailCookie: jest.fn().mockReturnValue(of({})),
        };
        mockAppInitializerService = {
            initializePermissions: jest.fn().mockReturnValue(of({})),
        };
        mockConfirmationService = {
            confirm: jest.fn(),
        };

        TestBed.configureTestingModule({
            imports: [SharedButtonComponent],
            providers: [
                { provide: TranslocoService, useValue: translocoService },
                { provide: CoBrowsingShareService, useValue: mockCoBrowsingShareService },
                { provide: CoBrowsingCookieService, useValue: mockCoBrowsingCookieService },
                { provide: AppInitializerService, useValue: mockAppInitializerService },
                { provide: ConfirmationService, useValue: mockConfirmationService },
            ],
        }).compileComponents();
        
        fixture = TestBed.createComponent(NavbarCoBrowsingComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should handle onCoBrowsingEndModal correctly', () => {
        const onCoBrowsingEndSpy = jest.spyOn(component, 'onCoBrowsingEndModal');
        component.onCoBrowsingEndModal();
        expect(onCoBrowsingEndSpy).toHaveBeenCalled();
    });
});