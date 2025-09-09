import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { 
  AuthService,
  SharedButtonComponent,
  SharedButtonType
} from '@customer-portal/shared';

@Component({
  selector: 'customer-portal-welcome',
  standalone: true,
  imports: [CommonModule, SharedButtonComponent, TranslocoModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  isUserValidated?: boolean;
  sharedButtonType = SharedButtonType;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.isUserValidated = window.history.state?.isUserValidated;
  }

  onLoginClick(): void {
    this.authService.login();
  }
}