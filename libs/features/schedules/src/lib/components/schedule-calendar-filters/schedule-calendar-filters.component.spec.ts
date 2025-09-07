import {
  createScheduleCalendarFilterStoreServiceMock,
  ScheduleCalendarFilterStoreService,
  ScheduleCalendarFilterTypes,
} from '@customer-portal/data-access/schedules';

import { ScheduleCalendarFiltersComponent } from './schedule-calendar-filters.component';

describe('ScheduleCalendarFiltersComponent', () => {
  let component: ScheduleCalendarFiltersComponent;
  const mockScheduleCalendarFilterStoreService: Partial<ScheduleCalendarFilterStoreService> =
    createScheduleCalendarFilterStoreServiceMock();

  beforeEach(async () => {
    component = new ScheduleCalendarFiltersComponent(
      mockScheduleCalendarFilterStoreService as ScheduleCalendarFilterStoreService,
    );
  });

  test('should handle ngOnInit correctly', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      mockScheduleCalendarFilterStoreService.loadScheduleCalendarFilterList,
    ).toHaveBeenCalled();
  });

  test('should handle onFilterChange correctly', () => {
    // Arrange
    const mockData = [1, 2, 3];
    const mockKey = ScheduleCalendarFilterTypes.Companies;

    // Act
    component.onFilterChange(mockData, mockKey);

    // Assert
    expect(
      mockScheduleCalendarFilterStoreService.updateScheduleCalendarFilterByKey,
    ).toHaveBeenCalledWith(mockData, mockKey);
  });
});
