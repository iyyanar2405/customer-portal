import { Selector } from '@ngxs/store';

import {
  applyGridConfig,
  FilteringConfig,
  FilterOptions,
  getNumberOfFilteredRecords,
  isAnyFilterActive,
} from '@customer-portal/shared';

import { ContractsListItemModel } from '../../models';
import {
  ContractsListState,
  ContractsListStateModel,
} from '../contracts-list.state';

export class ContractsListSelectors {
  @Selector([ContractsListSelectors._contracts])
  static contracts(
    contracts: ContractsListItemModel[],
  ): ContractsListItemModel[] {
    return contracts;
  }

  @Selector([ContractsListSelectors._totalFilteredRecords])
  static totalFilteredRecords(totalFilteredRecords: number): number {
    return totalFilteredRecords;
  }

  @Selector([ContractsListSelectors._filterOptions])
  static filterOptions(filterOptions: FilterOptions): FilterOptions {
    return filterOptions;
  }

  @Selector([ContractsListSelectors._filteringConfig])
  static filteringConfig(filteringConfig: FilteringConfig): FilteringConfig {
    return filteringConfig;
  }

  @Selector([ContractsListSelectors._hasActiveFilters])
  static hasActiveFilters(hasActiveFilters: boolean): boolean {
    return hasActiveFilters;
  }

  @Selector([ContractsListState])
  private static _contracts(
    state: ContractsListStateModel,
  ): ContractsListItemModel[] {
    const { contracts, gridConfig } = state;

    return applyGridConfig(contracts, gridConfig);
  }

  @Selector([ContractsListState])
  private static _totalFilteredRecords(state: ContractsListStateModel): number {
    const { contracts, gridConfig } = state;

    return getNumberOfFilteredRecords(contracts, gridConfig);
  }

  @Selector([ContractsListState])
  private static _filterOptions(state: ContractsListStateModel): FilterOptions {
    return state.filterOptions;
  }

  @Selector([ContractsListState])
  private static _filteringConfig(
    state: ContractsListStateModel,
  ): FilteringConfig {
    return state.gridConfig.filtering;
  }

  @Selector([ContractsListState])
  private static _hasActiveFilters(state: ContractsListStateModel): boolean {
    return isAnyFilterActive(state.gridConfig.filtering);
  }
}
