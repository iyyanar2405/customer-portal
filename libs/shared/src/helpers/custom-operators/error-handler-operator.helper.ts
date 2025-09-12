import { mergeMap, Observable, OperatorFunction, throwError } from 'rxjs';

interface ResponseBase {
  message: string | null | undefined;
  isSuccess: boolean;
}

export function throwIfNotSuccess<T extends ResponseBase>(): OperatorFunction<
  T,
  T
> {
  return (source$: Observable<T>) =>
    source$.pipe(
      mergeMap((value) => {
        if (!value || !value.isSuccess) {
          return throwError(() => new Error(value.message as string));
        }

        return [value];
      }),
    );
}
