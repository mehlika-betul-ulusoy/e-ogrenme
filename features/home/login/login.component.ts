import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Giriş başarısız. Email veya şifrenizi kontrol edin.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  onForgotPassword(): void {
    // Şifre sıfırlama sayfasına yönlendir
    this.router.navigate(['/auth/forgot-password']);
  }

  onGoToRegister(): void {
    this.router.navigate(['/home/register']);
  }

  onBackToHome(): void {
    this.router.navigate(['/home']);
  }

  loginAsTestUser(email: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(email, 'password123').subscribe({
      next: (response) => {
        console.log('Test user login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Test kullanıcı girişi başarısız.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return 'Bu alan zorunludur';
      }
      if (field.errors['email']) {
        return 'Geçerli bir email adresi giriniz';
      }
      if (field.errors['minlength']) {
        return `En az ${field.errors['minlength'].requiredLength} karakter olmalıdır`;
      }
    }
    return '';
  }
}
