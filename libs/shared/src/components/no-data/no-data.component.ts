import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-no-data',
  standalone: true,
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent {
  @Input() infoText = '';
  @Input() descriptionText = '';
  @Input() altText = '';
  @Input() error = false;
}
