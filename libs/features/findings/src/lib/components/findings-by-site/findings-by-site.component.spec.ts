import { FindingGraphsStoreService } from '@customer-portal/data-access/findings';

import { FindingsBySiteComponent } from './findings-by-site.component';

describe('FindingsBySiteComponent', () => {
  let component: FindingsBySiteComponent;
  let findingGraphsStoreServiceMock: jest.Mocked<FindingGraphsStoreService>;

  beforeEach(() => {
    findingGraphsStoreServiceMock = {
      loadFindingsGraphsData: jest.fn(),
    } as unknown as jest.Mocked<FindingGraphsStoreService>;

    component = new FindingsBySiteComponent(findingGraphsStoreServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
