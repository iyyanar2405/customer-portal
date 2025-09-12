import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'shared-error-card',
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorCardComponent {
  @Input() title = '';
  @Input() description = '';
}
