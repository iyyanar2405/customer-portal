import { TestScheduler } from 'rxjs/testing';
import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    service = new SpinnerService();
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  test('should set loading to true', () => {
    testScheduler.run(({ expectObservable }) => {
      service.setLoading(true, 'testQuery');
      expectObservable(service.isLoading$).toBe('a', { a: true });
    });
  });

  test('should set loading to false', () => {
    testScheduler.run(({ expectObservable }) => {
      service.setLoading(true, 'testQuery');
      service.setLoading(false, 'testQuery');
      expectObservable(service.isLoading$).toBe('a-b', { a: true, b: false });
    });
  });
});