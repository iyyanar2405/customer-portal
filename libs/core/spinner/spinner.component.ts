import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'lib-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, TranslocoModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  constructor(public spinnerService: SpinnerService) {}
}