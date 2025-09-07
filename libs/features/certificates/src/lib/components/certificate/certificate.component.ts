import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  SharedButtonToggleDatum,
  SharedPageToggleComponent,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-certificate',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    SharedPageToggleComponent,
  ],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateComponent {
  public pageToggleOptions: Partial<SharedButtonToggleDatum<string>>[] = [
    {
      i18nKey: 'buttons.toggle.lists',
      icon: 'list',
      label: 'Lists',
      value: './',
    },
    {
      i18nKey: 'buttons.toggle.graphs',
      icon: 'chart-pie',
      label: 'Graphs',
      value: 'graphs',
    },
  ];
}
