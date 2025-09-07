import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared';

import {
  CalendarScheduleDataDto,
  ScheduleCalendarFilterDataDto,
} from '../../dtos';
import { CalendarScheduleModel } from '../../models';
import { CalendarScheduleMapperService } from './calendar-schedule-mapper.service';

jest.mock('@customer-portal/shared', () => ({
  convertToUtcDate: jest.fn((date: string) => `UTC-${date}`),
}));

describe('CalendarScheduleMapperService', () => {
  describe('mapToCalendarScheduleModel', () => {
    test('should map CalendarScheduleDataDto to CalendarScheduleModel correctly', () => {
      // Arrange
      const mockData: CalendarScheduleDataDto[] = [
        {
          auditType: 'type1',
          city: 'City A',
          company: 'Company A',
          endDate: '2023-09-30',
          leadAuditor: 'Auditor A',
          services: ['Service A'],
          site: 'Site A',
          siteAddress: 'Site Address 1',
          siteAuditId: '1',
          siteRepresentatives: ['Rep A'],
          startDate: '2023-09-29',
          status: 'active',
        },
      ];
      const expected: CalendarScheduleModel[] = [
        {
          address: 'Site Address 1',
          auditType: 'type1',
          city: 'City A',
          company: 'Company A',
          endDate: '2023-09-30',
          leadAuditor: 'Auditor A',
          scheduleId: '1',
          service: 'Service A',
          site: 'Site A',
          siteRepresentative: 'Rep A',
          startDate: '2023-09-29',
          status: 'active',
        },
      ];

      // Act
      const result =
        CalendarScheduleMapperService.mapToCalendarScheduleModel(mockData);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('mapToScheduleCalendarFilterList', () => {
    test('should map ScheduleCalendarFilterDataDto to SharedSelectMultipleDatum correctly', () => {
      // Arrange
      const mockData: ScheduleCalendarFilterDataDto[] = [
        {
          id: 6,
          label: 'Completed',
        },
      ];
      const expected: SharedSelectMultipleDatum<number>[] = [
        {
          label: 'Completed',
          value: 6,
        },
      ];

      // Act
      const result =
        CalendarScheduleMapperService.mapToScheduleCalendarFilterList(mockData);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('mapToScheduleCalendarFilterTree', () => {
    test('should map ScheduleCalendarFilterDataDto to TreeNode correctly', () => {
      // Arrange
      const mockDataA: ScheduleCalendarFilterDataDto[] = [
        {
          id: 268,
          label: 'Australia',
          children: [
            {
              id: 1,
              label: 'Banksmeadow',
            },
          ],
        },
      ];
      const mockDataB: ScheduleCalendarFilterDataDto[] = [
        {
          id: 269,
          label: 'Austria',
          children: [],
        },
      ];
      const expectedA: TreeNode[] = [
        {
          data: 268,
          key: '268-Australia',
          label: 'Australia',
          children: [
            {
              data: 1,
              key: '1-Banksmeadow',
              label: 'Banksmeadow',
            },
          ],
        },
      ];
      const expectedB: TreeNode[] = [
        {
          data: 269,
          key: '269-Austria',
          label: 'Austria',
          children: undefined,
        },
      ];

      // Act
      const resultA =
        CalendarScheduleMapperService.mapToScheduleCalendarFilterTree(
          mockDataA,
        );
      const resultB =
        CalendarScheduleMapperService.mapToScheduleCalendarFilterTree(
          mockDataB,
        );

      // Assert
      expect(resultA).toEqual(expectedA);
      expect(resultB).toEqual(expectedB);
    });
  });
});
