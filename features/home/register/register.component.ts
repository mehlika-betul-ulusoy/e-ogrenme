import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  UserRole = UserRole;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.createForm();
  }

  ngOnInit(): void {
    // Form değişikliklerini izle (debug için)
    this.registerForm.get('userRole')?.valueChanges.subscribe(value => {
      console.log('Selected role:', value);
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      userRole: ['', [Validators.required]], // Rol seçimi - başlangıçta boş
      acceptTerms: [false, [Validators.requiredTrue]],
      marketingEmails: [false]
    }, { validators: this.passwordMatchValidator });
  }

  // Rol seçenekleri için getter
  get availableRoles() {
    return [
      { value: UserRole.EDUCATION_MANAGER, label: 'Eğitim Yöneticisi', description: 'Organizasyon kurucu ve yönetici' },
      { value: UserRole.INSTRUCTOR, label: 'Eğitmen', description: 'Kurs ve ders oluşturucu' },
      { value: UserRole.OBSERVER, label: 'Gözlemci', description: 'Raporlama ve analiz' },
      { value: UserRole.STUDENT, label: 'Öğrenci', description: 'Kurslara katılım' }
    ];
  }

  onRoleSelect(roleValue: UserRole): void {
    this.registerForm.patchValue({ userRole: roleValue });
    console.log('Role selected:', roleValue);
  }

  isRoleSelected(roleValue: UserRole): boolean {
    return this.registerForm.get('userRole')?.value === roleValue;
  }

  selectRole(roleValue: UserRole): void {
    this.registerForm.patchValue({ userRole: roleValue });
    console.log('Role selected:', roleValue);
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      const formValue = this.registerForm.value;
      const registerData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        role: formValue.userRole || UserRole.EDUCATION_MANAGER // Seçilen rol
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Kayıt işlemi başarısız. Lütfen bilgilerinizi kontrol edin.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  onGoToLogin(): void {
    this.router.navigate(['/home/login']);
  }

  onBackToHome(): void {
    this.router.navigate(['/home']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        if (fieldName === 'userRole') {
          return 'Lütfen bir rol seçiniz';
        }
        return 'Bu alan zorunludur';
      }
      if (field.errors['requiredTrue']) {
        return 'Kullanım şartlarını kabul etmelisiniz';
      }
      if (field.errors['email']) {
        return 'Geçerli bir email adresi giriniz';
      }
      if (field.errors['minlength']) {
        return `En az ${field.errors['minlength'].requiredLength} karakter olmalıdır`;
      }
      if (field.errors['pattern']) {
        return 'Geçerli bir domain formatı giriniz (örn: sirket.com)';
      }
      if (field.errors['passwordMismatch']) {
        return 'Şifreler eşleşmiyor';
      }
    }
    return '';
  }
}
