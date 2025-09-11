import { FindingGraphsStoreService } from '@customer-portal/data-access/findings';

import { FindingsByClauseComponent } from './findings-by-clause.component';

describe('FindingsByClauseComponent', () => {
  let component: FindingsByClauseComponent;
  let findingGraphsStoreServiceMock: jest.Mocked<FindingGraphsStoreService>;

  beforeEach(() => {
    findingGraphsStoreServiceMock = {
      loadFindingsByClauseList: jest.fn(),
    } as unknown as jest.Mocked<FindingGraphsStoreService>;

    component = new FindingsByClauseComponent(findingGraphsStoreServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
