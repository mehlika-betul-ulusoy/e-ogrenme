import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<any>();

  constructor() { }

  showSuccess(message: string): void {
    this.notificationSubject.next({ type: 'success', message });
  }

  showError(message: string): void {
    this.notificationSubject.next({ type: 'error', message });
  }

  showInfo(message: string): void {
    this.notificationSubject.next({ type: 'info', message });
  }

  getNotifications(): Observable<any> {
    return this.notificationSubject.asObservable();
  }
}
