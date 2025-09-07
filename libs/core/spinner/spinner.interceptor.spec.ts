import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { spinnerInterceptor } from './spinner.interceptor';
import { SpinnerService } from './spinner.service';

class MockHttpHandler implements HttpHandler {
  handle(): Observable<HttpEvent<any>> {
    return of(new HttpResponse({ status: 200, body: {} }));
  }
}

describe('spinnerInterceptor', () => {
  let spinnerServiceMock: jest.Mocked<SpinnerService>;
  const url = 'https://test.com';
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => spinnerInterceptor(req, next));

  beforeEach(() => {
    spinnerServiceMock = {
      setLoading: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: HTTP_INTERCEPTORS, useValue: spinnerInterceptor, multi: true }
      ],
    });
  });

  test('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  test('should not intercept when SKIP_LOADING header present', (done) => {
    const headers = new HttpHeaders({ SKIP_LOADING: 'true' });
    const req = new HttpRequest('GET', url, { headers });

    interceptor(req, new MockHttpHandler().handle).subscribe(() => {
      expect(spinnerServiceMock.setLoading).not.toHaveBeenCalled();
      done();
    });
  });

  test('should intercept POST with query params', (done) => {
    const req = new HttpRequest('POST', url, { query: 'test' });

    interceptor(req, new MockHttpHandler().handle).subscribe(() => {
      expect(spinnerServiceMock.setLoading).toHaveBeenCalledWith(true, 'test');
      expect(spinnerServiceMock.setLoading).toHaveBeenCalledWith(false, 'test');
      done();
    });
  });

  test('should handle POST without body', (done) => {
    const req = new HttpRequest('POST', url, null);

    interceptor(req, new MockHttpHandler().handle).subscribe(() => {
      expect(spinnerServiceMock.setLoading).toHaveBeenCalledWith(true, url);
      expect(spinnerServiceMock.setLoading).toHaveBeenCalledWith(false, url);
      done();
    });
  });

  test('should handle query in POST body', (done) => {
    const body = {
      operationName: null,
      variables: {},
      query: '{ testQuery { field1 field2 } }',
    };
    const req = new HttpRequest('POST', url, body);

    interceptor(req, new MockHttpHandler().handle).subscribe(() => {
      expect(spinnerServiceMock.setLoading).toHaveBeenCalledTimes(2);
      expect(spinnerServiceMock.setLoading).toHaveBeenCalledWith(true, body.query);
      expect(spinnerServiceMock.setLoading).toHaveBeenCalledWith(false, body.query);
      done();
    });
  });
});