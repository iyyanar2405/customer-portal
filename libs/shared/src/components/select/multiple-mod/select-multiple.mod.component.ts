import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import {
  TriStateCheckboxChangeEvent,
  TriStateCheckboxModule,
} from 'primeng/tristatecheckbox';

import { SharedSelectMultipleDatum } from '../multiple/select-multiple.component';
import {
  SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_DEFAULT_DELAY_MS,
  SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_LARGE_DELAY_MS,
  SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_LIMIT,
  SHARED_SELECT_MULTIPLE_SCROLL_HEIGHT_PX,
  SHARED_SELECT_MULTIPLE_SEARCH_LIMIT,
} from './select-multiple.mod.constants';

@Component({
  selector: 'shared-select-multiple-mod',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoDirective,
    MultiSelectModule,
    TooltipModule,
    TriStateCheckboxModule,
  ],
  templateUrl: './select-multiple.mod.component.html',
  styleUrl: './select-multiple.mod.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedSelectMultipleModComponent<T> {
  private isAutoSelected = false;

  public ariaLabel = input<string>();
  public isDisabled = input<boolean>(false);
  public options = input.required<SharedSelectMultipleDatum<T>[]>();
  public placeholder = input<string>();
  public prefill = input<T[]>([]);
  public appendTo = input<HTMLElement | string>('');

  public changeEvent = output<T[]>();

  public hasSearch = computed(
    () => this.options().length > SHARED_SELECT_MULTIPLE_SEARCH_LIMIT,
  );

  public hasTooltip = computed(
    () => this.selected().length > SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_LIMIT,
  );

  public tooltipDelay = computed(() =>
    this.hasTooltip()
      ? SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_DEFAULT_DELAY_MS
      : SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_LARGE_DELAY_MS,
  );

  public scrollHeight = `${SHARED_SELECT_MULTIPLE_SCROLL_HEIGHT_PX}px`;

  public selected = signal<T[]>([]);
  public selectedTooltip = computed(() => this.getSelectedTooltip());

  public triState = computed(() =>
    this.selected().length !== 0
      ? this.options().length === this.selected().length
      : null,
  );

  constructor(private ref: ChangeDetectorRef) {
    effect(() => this.preselectItems());
  }

  onChange(event: MultiSelectChangeEvent): void {
    this.isAutoSelected = false;
    this.selected.set(event.value);
    this.changeEvent.emit(this.selected());
  }

  onChangeTriState(event: TriStateCheckboxChangeEvent): void {
    event.originalEvent.stopImmediatePropagation();
    this.isAutoSelected = false;
    const newSelected = this.getSelectedByTriState(event.value);
    this.selected.set(newSelected);
    this.changeEvent.emit(newSelected);
  }

  private preselectItems(): void {
    const options = this.options();
    const validValues = options.map((o) => o.value);
    const trimmedPrefill = this.getTrimmedPrefill(validValues);
    const currentSelected = this.selected();

    // Always set selection to trimmed prefill (no emit)
    if (!this.arraysEqual(currentSelected, trimmedPrefill)) {
      this.setSelection(trimmedPrefill, false);
    }
  }

  private setSelection(values: T[], isAuto: boolean): void {
    const newValues = [...(values ?? [])];

    if (!this.arraysEqual(this.selected(), newValues)) {
      this.selected.set(newValues);
      // this.changeEvent.emit(newValues);
    }

    this.isAutoSelected = isAuto;
    // this.ref.markForCheck();
    this.ref.detectChanges();
  }

  private getTrimmedPrefill(validValues: T[]): T[] {
    return this.prefill().filter((v) => validValues.includes(v));
  }

  private getSelectedByTriState(value: boolean | null): T[] {
    return value ? this.options().map((o) => o.value) : [];
  }

  private getSelectedTooltip(): string {
    return this.options()
      .filter((o) => this.selected().includes(o.value))
      .map((o) => o.label)
      .join(', ');
  }

  private arraysEqual(a: T[], b: T[]): boolean {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
}
