import { FilterValue } from '@customer-portal/shared';

export class OverviewUpcomingSetSelectedDate {
  static readonly type = '[Overview Shared] Set Selected Date';

  constructor(public date: Date | undefined) {}
}

export class OverviewFinancialNavigateToListView {
  static readonly type = '[Overview Shared] Navigate From Chart To List View';

  constructor(public tooltipFilters: FilterValue[]) {}
}

export class SetFinancialStatusChartNavigationPayload {
  static readonly type =
    '[Overview Shared] Set Financial Status Chart Navigation Payload';

  constructor(public chartNavigationPayload: FilterValue[]) {}
}

export class ResetOverviewSharedState {
  static readonly type = '[Overview Shared] Reset State';
}

export abstract class NavigateFromOverviewCardAction {
  constructor(public overviewCardFilters: FilterValue[]) {}
}
export class NavigateFromOverviewCardToAuditListView extends NavigateFromOverviewCardAction {
  static readonly type =
    '[Overview Shared] Navigate From Overview Card To Audit List View';
}

export class NavigateFromOverviewCardToScheduleListView extends NavigateFromOverviewCardAction {
  static readonly type =
    '[Overview Shared] Navigate From Overview Card To Schedule List View';
}

export class NavigateFromOverviewCardToFindingsListView extends NavigateFromOverviewCardAction {
  static readonly type =
    '[Overview Shared] Navigate From Overview Card To Findings List View';
}
