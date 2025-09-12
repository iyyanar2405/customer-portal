import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { CalendarModule } from 'primeng/calendar';
import {
  Dropdown,
  DropdownChangeEvent,
  DropdownModule,
} from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { SHORT_MONTH_DATE_FORMAT } from '../../../constants';
import { getTimeModRange } from '../../../helpers';
import { TimeRange } from '../../../models';
import { SharedSelectDateRangeDatum } from '../date-range/select-date-range.component';
import {
  DATE_RANGE_EMPTY_OPTION,
  SHARED_SELECT_DATE_RANGE_DEFAULT_DATA,
  SHARED_SELECT_DATE_RANGE_SCROLL_HEIGHT_PX,
} from '../date-range/select-date-range.constants';

@Component({
  selector: 'shared-select-date-range-mod',
  imports: [
    CommonModule,
    FormsModule,
    TranslocoDirective,
    CalendarModule,
    DropdownModule,
    OverlayPanelModule,
  ],
  providers: [DatePipe],
  templateUrl: './select-date-range-mod.component.html',
  styleUrl: './select-date-range-mod.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedSelectDateRangeModComponent {
  @ViewChild('dropdown') dropdown!: Dropdown;

  public ariaLabel = input<string>();
  public data = input<TimeRange[]>(SHARED_SELECT_DATE_RANGE_DEFAULT_DATA);
  public isDisabled = input<boolean>(false);
  public prefill = input<TimeRange | string>();
  public customRange = input<Date[] | null>(null);
  public changeEvent = output<{ range: Date[]; type: TimeRange }>();

  public isRangeCustomLabelVisible = signal(false);
  public options = computed<SharedSelectDateRangeDatum[]>(() => [
    DATE_RANGE_EMPTY_OPTION,
    ...this.getOptions(this.data()),
  ]);
  public range = signal<Date[]>(this.options()[0].range);
  public rangeCustom!: Date[] | null;
  public rangeCustomLabel = computed<any>(() => this.getRangeLabel());
  public scrollHeight = `${SHARED_SELECT_DATE_RANGE_SCROLL_HEIGHT_PX}px`;
  public selected = signal<SharedSelectDateRangeDatum>(DATE_RANGE_EMPTY_OPTION);
  public placeholder = `${SHORT_MONTH_DATE_FORMAT} - ${SHORT_MONTH_DATE_FORMAT}`;

  constructor(private readonly datePipe: DatePipe) {
    effect(() => {
      if (this.prefill() === TimeRange.Custom && this.customRange()) {
        this.range.set(this.customRange()!);
        this.isRangeCustomLabelVisible.set(true);
        this.selected.set(
          this.options().find((opt) => opt.id === TimeRange.Custom)!,
        );
      } else {
        this.selected.set(this.getSelected());
        this.range.set(this.selected().range);
        this.isRangeCustomLabelVisible.set(false);
      }
    });
  }

  onChange(event: DropdownChangeEvent): void {
    this.rangeCustom = null;
    this.range.set(event.value.range);
    this.isRangeCustomLabelVisible.set(false);
    this.selected.set(event.value);
    this.changeEvent.emit({
      range: event.value.id === '' ? [] : this.range(),
      type: event.value.id as TimeRange,
    });
  }

  onClick(event: Event, datum: SharedSelectDateRangeDatum): void {
    if (datum.id === TimeRange.Custom) {
      event.stopPropagation();
    }
  }

  onSelect(): void {
    if (!this.rangeCustom) {
      return;
    }

    if (this.rangeCustom.every((d) => d !== null)) {
      this.range.set(this.rangeCustom);
      this.isRangeCustomLabelVisible.set(true);
      this.selected.set(
        this.options().find(
          (opt) => opt.id === TimeRange.Custom,
        ) as SharedSelectDateRangeDatum,
      );
      this.changeEvent.emit({ range: this.range(), type: TimeRange.Custom });
      this.selected.set(
        this.options().find(
          (opt) => opt.id === TimeRange.Custom,
        ) as SharedSelectDateRangeDatum,
      );
      this.dropdown.hide();
    }
  }

  private getOptions(data: TimeRange[]): SharedSelectDateRangeDatum[] {
    return data.map((datum) => ({
      id: datum,
      label: `select.dateRange.${datum}`,
      range: getTimeModRange(datum),
    }));
  }

  private getSelected(): SharedSelectDateRangeDatum {
    const found = this.options().find((o) => o.id === this.prefill());

    return found || DATE_RANGE_EMPTY_OPTION;
  }

  private getRangeLabel() {
    const start = this.range()[0];
    const end = this.range()[1];

    return {
      start: `${start.getUTCDate().toString().padStart(2, '0')}-${(start.getUTCMonth() + 1).toString().padStart(2, '0')}-${start.getUTCFullYear()}`,
      end: `${end.getUTCDate().toString().padStart(2, '0')}-${(end.getUTCMonth() + 1).toString().padStart(2, '0')}-${end.getUTCFullYear()}`,
    };
  }
}
