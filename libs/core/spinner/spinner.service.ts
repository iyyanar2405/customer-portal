import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private loadingRequestsMap: Map<string, boolean> = new Map<string, boolean>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  setLoading(loading: boolean, query: string): void {
    if (loading) {
      this.loadingRequestsMap.set(query, true);
      this.loadingSubject.next(true);
    } else if (this.loadingRequestsMap.has(query)) {
      this.loadingRequestsMap.delete(query);
    }

    if (this.loadingRequestsMap.size === 0) {
      this.loadingSubject.next(false);
    }
  }
}