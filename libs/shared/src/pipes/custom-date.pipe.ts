import { Pipe, PipeTransform } from '@angular/core';

import { formatCustomDate } from '../helpers/date/date.helpers';

@Pipe({ name: 'customDate', standalone: true })
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    return formatCustomDate(value);
  }
}
