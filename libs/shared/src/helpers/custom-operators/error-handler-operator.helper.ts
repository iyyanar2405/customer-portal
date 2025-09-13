// libs/shared/helpers/src/lib/rx-operators/throw-if-not-success.ts
import { mergeMap, Observable, OperatorFunction, throwError } from 'rxjs';

interface ResponseBase {
  message: string | null | undefined;
  isSuccess: boolean;
}

export function throwIfNotSuccess<T extends ResponseBase>(): OperatorFunction<T, T> {
  return (source$: Observable<T>) =>
    source$.pipe(
      mergeMap((value) => {
        if (!value || !value.isSuccess) {
          return throwError(() => new Error(value.message ?? 'Request failed'));
        }
        return [value];
      }),
    );
}
