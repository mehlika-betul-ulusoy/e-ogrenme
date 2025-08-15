import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { 
    // Check for existing session
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<any> {
    // Simulated login - in real app this would call backend
    
    // Email'e göre rol belirleme (demo için)
    let role = this.determineRoleByEmail(email);
    
    const mockUser: User = {
      id: Date.now().toString(),
      email: email,
      firstName: this.getFirstNameFromEmail(email),
      lastName: 'Demo',
      role: role,
      organizationId: this.getOrganizationByEmail(email),
      isActive: true,
      createdAt: new Date()
    };

    return of({ success: true, user: mockUser }).pipe(
      delay(1000),
      tap(response => {
        if (response.success) {
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  private determineRoleByEmail(email: string): UserRole {
    // Demo amaçlı email pattern'lerine göre rol belirleme
    const emailLower = email.toLowerCase();
    
    if (emailLower.includes('superadmin') || emailLower.includes('admin') || emailLower.includes('root')) {
      return UserRole.SUPER_ADMIN;
    } else if (emailLower.includes('manager') || emailLower.includes('yonetici')) {
      return UserRole.EDUCATION_MANAGER;
    } else if (emailLower.includes('instructor') || emailLower.includes('egitmen') || emailLower.includes('teacher')) {
      return UserRole.INSTRUCTOR;
    } else if (emailLower.includes('observer') || emailLower.includes('gozlemci') || emailLower.includes('rapor')) {
      return UserRole.OBSERVER;
    } else {
      return UserRole.STUDENT; // Default
    }
  }

  private getFirstNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private getOrganizationByEmail(email: string): string {
    const domain = email.split('@')[1];
    return domain ? domain.split('.')[0] : 'default-org';
  }

  logout(): void {
    console.log('AuthService logout başladı');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    console.log('AuthService logout tamamlandı');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  register(userData: any): Observable<any> {
    // Simulated registration
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || UserRole.EDUCATION_MANAGER, // Seçilen rol kullanılır
      organizationId: Date.now().toString(),
      isActive: true,
      createdAt: new Date()
    };

    return of({ success: true, user: newUser }).pipe(
      delay(1000),
      tap(response => {
        if (response.success) {
          this.setCurrentUser(response.user);
        }
      })
    );
  }
}
