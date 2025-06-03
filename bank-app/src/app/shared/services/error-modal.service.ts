import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorModalService {
  private errorSubject = new Subject<string>();

  showError(message: string) {
    this.errorSubject.next(message);
  }

  get errors$(): Observable<string> {
    return this.errorSubject.asObservable();
  }
}