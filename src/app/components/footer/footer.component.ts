import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

interface LinkModel {
  url: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'customer-portal-footer',
  standalone: true,
  imports: [CommonModule, TranslocoDirective],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  footerLeftLinks: LinkModel[] = [
    {
      url: 'https://www.dnv.com/assurance',
      label: 'footer_aboutUs',
    },
    {
      url: 'https://www.dnv.com/privacy/',
      label: 'footer_privacyStatement',
    },
    {
      url: 'https://www.dnv.com/tems/',
      label: 'footer_termsOfUse',
    },
  ];

  footerRightLinks: LinkModel[] = [
    {
      url: 'https://www.linkedin.com/showcase/dnv-assurance',
      label: 'footer_linkedin',
      icon: 'pi pi-linkedin',
    },
    {
      url: 'https://www.dnv.com/system/copyright/',
      label: 'footer_copyright',
    },
  ];
}