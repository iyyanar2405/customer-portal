import { createSelector, Selector } from '@ngxs/store';

import {
  applyGridConfig,
  DEFAULT_GRID_CONFIG,
  FilteringConfig,
  FilterOptions,
  getNumberOfFilteredRecords,
  GridConfig,
  isAnyFilterActive,
} from '@customer-portal/shared';

import { InvoiceListItemModel } from '../../models';
import { InvoiceListState, InvoiceListStateModel } from '../invoice-list.state';

export class InvoiceListSelectors {
  @Selector([InvoiceListSelectors.invoices, InvoiceListSelectors.gridConfig])
  static invoicesWithGridConfig(
    invoices: InvoiceListItemModel[],
    gridConfig: GridConfig,
  ): InvoiceListItemModel[] {
    return applyGridConfig(invoices, gridConfig);
  }

  static invoicesByIds(ids: string[]) {
    return createSelector(
      [InvoiceListSelectors.invoicesWithGridConfig],
      (invoices: InvoiceListItemModel[]) =>
        invoices.filter((item) => ids.includes(item.invoiceId)),
    );
  }

  @Selector([InvoiceListSelectors.invoices, InvoiceListSelectors.gridConfig])
  static totalFilteredRecords(
    invoices: InvoiceListItemModel[],
    gridConfig: GridConfig,
  ): number {
    return getNumberOfFilteredRecords(invoices, gridConfig);
  }

  @Selector([InvoiceListState])
  static hasActiveFilters(state: InvoiceListStateModel): boolean {
    return isAnyFilterActive(state.gridConfig.filtering);
  }

  @Selector([InvoiceListState])
  static filteringConfig(state: InvoiceListStateModel): FilteringConfig {
    return state.gridConfig.filtering;
  }

  @Selector([InvoiceListState])
  static filterOptions(state: InvoiceListStateModel): FilterOptions {
    return state.filterOptions;
  }

  @Selector([InvoiceListState])
  static canUploadData(state: InvoiceListStateModel): boolean {
    return state.canUploadData;
  }

  @Selector([InvoiceListState])
  private static invoices(
    state: InvoiceListStateModel,
  ): InvoiceListItemModel[] {
    return state?.invoices ?? [];
  }

  @Selector([InvoiceListState])
  private static gridConfig(state: InvoiceListStateModel): GridConfig {
    return state?.gridConfig ?? DEFAULT_GRID_CONFIG;
  }
}
