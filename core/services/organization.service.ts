import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Organization, OrganizationSettings, OrganizationStats } from '../models/organization.model';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private organizationsSubject = new BehaviorSubject<Organization[]>([]);
  public organizations$ = this.organizationsSubject.asObservable();
  
  private currentOrganizationSubject = new BehaviorSubject<Organization | null>(null);
  public currentOrganization$ = this.currentOrganizationSubject.asObservable();

  constructor() {
    this.loadOrganizations();
  }

  private loadOrganizations(): void {
    // Simulated organizations data
    const mockOrganizations: Organization[] = [
      {
        id: '1',
        name: 'TechCorp Academy',
        description: 'Corporate training platform for TechCorp employees',
        domain: 'techcorp.com',
        logo: '/assets/logos/techcorp.png',
        settings: {
          allowSelfRegistration: true,
          defaultUserRole: UserRole.STUDENT,
          theme: 'light',
          branding: {
            primaryColor: '#2563eb',
            secondaryColor: '#1e40af',
            logo: '/assets/logos/techcorp.png'
          },
          features: {
            enableGamification: true,
            enableReports: true,
            enableCertificates: true,
            enableDiscussions: true,
            enableLiveSessions: true
          }
        },
        stats: {
          totalUsers: 150,
          totalCourses: 25,
          totalCompletions: 450,
          activeUsers: 89,
          avgCourseCompletion: 78.5
        },
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01')
      }
    ];
    
    this.organizationsSubject.next(mockOrganizations);
  }

  getOrganizations(): Observable<Organization[]> {
    return this.organizations$;
  }

  getOrganizationById(id: string): Observable<Organization | null> {
    return this.organizations$.pipe(
      map(orgs => orgs.find(org => org.id === id) || null)
    );
  }

  getCurrentOrganization(): Observable<Organization | null> {
    return this.currentOrganization$;
  }

  setCurrentOrganization(organizationId: string): Observable<Organization | null> {
    return this.getOrganizationById(organizationId).pipe(
      tap(org => this.currentOrganizationSubject.next(org))
    );
  }

  createOrganization(orgData: Partial<Organization>): Observable<Organization> {
    if (!orgData.name) {
      return throwError(() => new Error('Organization name is required'));
    }

    return of(null).pipe(
      delay(1000),
      map(() => {
        const newOrganization: Organization = {
          id: this.generateId(),
          name: orgData.name!,
          description: orgData.description || '',
          domain: orgData.domain,
          logo: orgData.logo,
          settings: {
            allowSelfRegistration: orgData.settings?.allowSelfRegistration || false,
            defaultUserRole: orgData.settings?.defaultUserRole || UserRole.STUDENT,
            theme: orgData.settings?.theme || 'light',
            branding: {
              primaryColor: '#2563eb',
              secondaryColor: '#1e40af',
              ...orgData.settings?.branding
            },
            features: {
              enableGamification: false,
              enableReports: true,
              enableCertificates: true,
              enableDiscussions: true,
              enableLiveSessions: false,
              ...orgData.settings?.features
            }
          },
          stats: {
            totalUsers: 0,
            totalCourses: 0,
            totalCompletions: 0,
            activeUsers: 0,
            avgCourseCompletion: 0
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const currentOrgs = this.organizationsSubject.value;
        this.organizationsSubject.next([...currentOrgs, newOrganization]);
        
        return newOrganization;
      })
    );
  }

  updateOrganization(id: string, updates: Partial<Organization>): Observable<Organization> {
    return this.organizations$.pipe(
      delay(1000),
      map(orgs => {
        const index = orgs.findIndex(org => org.id === id);
        if (index === -1) {
          throw new Error('Organization not found');
        }

        const updatedOrg = {
          ...orgs[index],
          ...updates,
          updatedAt: new Date()
        };

        const updatedOrgs = [...orgs];
        updatedOrgs[index] = updatedOrg;
        this.organizationsSubject.next(updatedOrgs);
        
        return updatedOrg;
      })
    );
  }

  deleteOrganization(id: string): Observable<boolean> {
    return this.organizations$.pipe(
      delay(500),
      map(orgs => {
        const filtered = orgs.filter(org => org.id !== id);
        this.organizationsSubject.next(filtered);
        return true;
      })
    );
  }

  getOrganizationStats(id: string): Observable<OrganizationStats> {
    return this.getOrganizationById(id).pipe(
      map(org => org?.stats || {
        totalUsers: 0,
        totalCourses: 0,
        totalCompletions: 0,
        activeUsers: 0,
        avgCourseCompletion: 0
      })
    );
  }

  checkDomainAvailability(domain: string): Observable<boolean> {
    return this.organizations$.pipe(
      delay(500),
      map(orgs => !orgs.some(org => org.domain === domain))
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
