import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { environment } from '@customer-portal/environments';
import { 
  AuthService, 
  SharedButtonComponent, 
  SharedButtonType 
} from '@customer-portal/shared';

@Component({
  selector: 'customer-portal-logout',
  standalone: true,
  imports: [CommonModule, SharedButtonComponent, TranslocoModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  dwLink = environment.dnwLink;
  sharedButtonType = SharedButtonType;

  constructor(private readonly authService: AuthService) {}

  onLoginClick(): void {
    this.authService.login();
  }

  onGoToDnwClick(): void {
    window.open(this.dwLink, '_self');
  }
}