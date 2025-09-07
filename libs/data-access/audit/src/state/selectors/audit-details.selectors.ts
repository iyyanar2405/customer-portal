import { Selector } from '@ngxs/store';

import {
  applyGridConfig,
  FilteringConfig,
  FilterOptions,
  getNumberOfFilteredRecords,
  isAnyFilterActive,
} from '@customer-portal/shared';

import {
  AuditDetailsModel,
  AuditDocumentListItemModel,
  AuditFindingListItemModel,
  AuditSiteListItemModel,
  SubAuditListItemModel,
} from '../../models';
import {
  AuditDetailsState,
  AuditDetailsStateModel,
} from '../audit-details.state';

export class AuditDetailsSelectors {
  @Selector([AuditDetailsSelectors._auditDetails])
  static auditDetails(auditDetails: AuditDetailsModel): AuditDetailsModel {
    return auditDetails;
  }

  @Selector([AuditDetailsSelectors._auditFindingItems])
  static auditFindingItems(
    auditFindingItems: AuditFindingListItemModel[],
  ): AuditFindingListItemModel[] {
    return auditFindingItems;
  }

  @Selector([AuditDetailsSelectors._auditFindingTotalFilteredRecords])
  static auditFindingTotalFilteredRecords(
    auditFindingTotalFilteredRecords: number,
  ): number {
    return auditFindingTotalFilteredRecords;
  }

  @Selector([AuditDetailsSelectors._auditFindingFilterOptions])
  static auditFindingFilterOptions(
    auditFindingFilterOptions: FilterOptions,
  ): FilterOptions {
    return auditFindingFilterOptions;
  }

  @Selector([AuditDetailsSelectors._auditFindingFilteringConfig])
  static auditFindingFilteringConfig(
    auditFindingFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return auditFindingFilteringConfig;
  }

  @Selector([AuditDetailsSelectors._auditFindingHasActiveFilters])
  static auditFindingHasActiveFilters(
    auditFindingHasActiveFilters: boolean,
  ): boolean {
    return auditFindingHasActiveFilters;
  }

  @Selector([AuditDetailsSelectors._subAuditItems])
  static subAuditItems(
    subAuditItems: SubAuditListItemModel[],
  ): SubAuditListItemModel[] {
    return subAuditItems;
  }

  @Selector([AuditDetailsSelectors._subAuditTotalFilteredRecords])
  static subAuditTotalFilteredRecords(
    subAuditTotalFilteredRecords: number,
  ): number {
    return subAuditTotalFilteredRecords;
  }

  @Selector([AuditDetailsSelectors._subAuditFilterOptions])
  static subAuditFilterOptions(
    subAuditFilterOptions: FilterOptions,
  ): FilterOptions {
    return subAuditFilterOptions;
  }

  @Selector([AuditDetailsSelectors._subAuditFilteringConfig])
  static subAuditFilteringConfig(
    subAuditFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return subAuditFilteringConfig;
  }

  @Selector([AuditDetailsSelectors._subAuditHasActiveFilters])
  static subAuditHasActiveFilters(subAuditHasActiveFilters: boolean): boolean {
    return subAuditHasActiveFilters;
  }

  @Selector([AuditDetailsSelectors._siteItems])
  static siteItems(
    siteItems: AuditSiteListItemModel[],
  ): AuditSiteListItemModel[] {
    return siteItems;
  }

  @Selector([AuditDetailsSelectors._siteItemsTotalFilteredRecords])
  static siteItemsTotalFilteredRecords(
    siteItemsTotalFilteredRecords: number,
  ): number {
    return siteItemsTotalFilteredRecords;
  }

  @Selector([AuditDetailsSelectors._siteItemsFilterOptions])
  static siteItemsFilterOptions(
    siteItemsFilterOptions: FilterOptions,
  ): FilterOptions {
    return siteItemsFilterOptions;
  }

  @Selector([AuditDetailsSelectors._siteItemsFilteringConfig])
  static siteItemsFilteringConfig(
    siteItemsFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return siteItemsFilteringConfig;
  }

  @Selector([AuditDetailsSelectors._siteItemsHasActiveFilters])
  static siteItemsHasActiveFilters(
    siteItemsHasActiveFilters: boolean,
  ): boolean {
    return siteItemsHasActiveFilters;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsList])
  static auditDocumentsList(
    auditDocumentsList: AuditDocumentListItemModel[],
  ): AuditDocumentListItemModel[] {
    return auditDocumentsList;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsTotalFilteredRecords])
  static auditDocumentsTotalFilteredRecords(
    auditDocumentsTotalFilteredRecords: number,
  ): number {
    return auditDocumentsTotalFilteredRecords;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsFilterOptions])
  static auditDocumentsFilterOptions(
    auditDocumentsFilterOptions: FilterOptions,
  ): FilterOptions {
    return auditDocumentsFilterOptions;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsFilteringConfig])
  static auditDocumentsFilteringConfig(
    auditDocumentsFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return auditDocumentsFilteringConfig;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsHasActiveFilters])
  static auditDocumentsHasActiveFilters(
    auditDocumentsHasActiveFilters: boolean,
  ): boolean {
    return auditDocumentsHasActiveFilters;
  }

  @Selector([AuditDetailsState])
  private static _auditDetails(
    state: AuditDetailsStateModel,
  ): AuditDetailsModel {
    return state.auditDetails;
  }

  @Selector([AuditDetailsState])
  private static _auditFindingItems(
    state: AuditDetailsStateModel,
  ): AuditFindingListItemModel[] {
    const { auditFindingItems, auditFindingGridConfig } = state;

    return applyGridConfig(auditFindingItems, auditFindingGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _auditFindingTotalFilteredRecords(
    state: AuditDetailsStateModel,
  ): number {
    const { auditFindingItems, auditFindingGridConfig } = state;

    return getNumberOfFilteredRecords(
      auditFindingItems,
      auditFindingGridConfig,
    );
  }

  @Selector([AuditDetailsState])
  private static _auditFindingFilterOptions(
    state: AuditDetailsStateModel,
  ): FilterOptions {
    return state.auditFindingFilterOptions;
  }

  @Selector([AuditDetailsState])
  private static _auditFindingFilteringConfig(
    state: AuditDetailsStateModel,
  ): FilteringConfig {
    return state.auditFindingGridConfig.filtering;
  }

  @Selector([AuditDetailsState])
  private static _auditFindingHasActiveFilters(
    state: AuditDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.auditFindingGridConfig.filtering);
  }

  @Selector([AuditDetailsState])
  private static _subAuditItems(
    state: AuditDetailsStateModel,
  ): SubAuditListItemModel[] {
    const { subAuditItems, subAuditGridConfig } = state;

    return applyGridConfig(subAuditItems, subAuditGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _subAuditTotalFilteredRecords(
    state: AuditDetailsStateModel,
  ): number {
    const { subAuditItems, subAuditGridConfig } = state;

    return getNumberOfFilteredRecords(subAuditItems, subAuditGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _subAuditFilterOptions(
    state: AuditDetailsStateModel,
  ): FilterOptions {
    return state.subAuditFilterOptions;
  }

  @Selector([AuditDetailsState])
  private static _subAuditFilteringConfig(
    state: AuditDetailsStateModel,
  ): FilteringConfig {
    return state.subAuditGridConfig.filtering;
  }

  @Selector([AuditDetailsState])
  private static _subAuditHasActiveFilters(
    state: AuditDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.subAuditGridConfig.filtering);
  }

  @Selector([AuditDetailsState])
  private static _siteItems(
    state: AuditDetailsStateModel,
  ): AuditSiteListItemModel[] {
    const { siteItems, siteItemsGridConfig } = state;

    return applyGridConfig(siteItems, siteItemsGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _siteItemsTotalFilteredRecords(
    state: AuditDetailsStateModel,
  ): number {
    const { siteItems, siteItemsGridConfig } = state;

    return getNumberOfFilteredRecords(siteItems, siteItemsGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _siteItemsFilterOptions(
    state: AuditDetailsStateModel,
  ): FilterOptions {
    return state.siteItemsFilterOptions;
  }

  @Selector([AuditDetailsState])
  private static _siteItemsFilteringConfig(
    state: AuditDetailsStateModel,
  ): FilteringConfig {
    return state.siteItemsGridConfig.filtering;
  }

  @Selector([AuditDetailsState])
  private static _siteItemsHasActiveFilters(
    state: AuditDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.siteItemsGridConfig.filtering);
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsList(
    state: AuditDetailsStateModel,
  ): AuditDocumentListItemModel[] {
    const { auditDocumentsList, auditDocumentsGridConfig } = state;

    return applyGridConfig(auditDocumentsList, auditDocumentsGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsTotalFilteredRecords(
    state: AuditDetailsStateModel,
  ): number {
    const { auditDocumentsList, auditDocumentsGridConfig } = state;

    return getNumberOfFilteredRecords(
      auditDocumentsList,
      auditDocumentsGridConfig,
    );
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsFilterOptions(
    state: AuditDetailsStateModel,
  ): FilterOptions {
    return state.auditDocumentsFilterOptions;
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsFilteringConfig(
    state: AuditDetailsStateModel,
  ): FilteringConfig {
    return state.auditDocumentsGridConfig.filtering;
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsHasActiveFilters(
    state: AuditDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.auditDocumentsGridConfig.filtering);
  }
}
