import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { SpinnerService } from './spinner.service';

export const spinnerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const spinnerService = inject(SpinnerService);

  if (req.headers.has('SKIP_LOADING')) {
    return next(req);
  }

  const query = req.body?.query || req.urlWithParams;
  spinnerService.setLoading(true, query);

  return next(req).pipe(
    finalize(() => {
      spinnerService.setLoading(false, query);
    })
  );
};