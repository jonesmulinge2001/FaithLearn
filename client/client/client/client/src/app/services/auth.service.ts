import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import {
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  GenericResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiBase}/auth`;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Restore session if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  // ==========================
  // API CALLS
  // ==========================

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, data);
  }

  verifyEmail(data: VerifyEmailRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${this.baseUrl}/verify-email`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  requestVerificationCode(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${this.baseUrl}/request-verification-code`,
      { email }
    );
  }

  forgotPassword(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${this.baseUrl}/forgot-password`, {
      email,
    });
  }

  resetPassword(data: ResetPasswordRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${this.baseUrl}/reset-password`,
      data
    );
  }

  resendRequestCode(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${this.baseUrl}/resend-reset-code`,
      { email }
    );
  }

  // ==========================
  // HANDLER METHODS
  // ==========================

  handleRegister(data: RegisterRequest): void {
    this.loadingSubject.next(true);

    this.register(data).subscribe({
      next: () => {
        this.toastr.success('Registration successful');
        localStorage.setItem('verifyEmail', data.email);
        this.router.navigate(['/verify-email']);
        this.loadingSubject.next(false);
      },
      error: () => {
        this.toastr.error('Registration failed');
        this.loadingSubject.next(false);
      },
    });
  }

  handleLogin(data: LoginRequest): void {
    this.loadingSubject.next(true);

    this.login(data).subscribe({
      next: (response) => {
        if (!response.success || !response.data) {
          this.toastr.error('Invalid credentials');
          this.loadingSubject.next(false);
          return;
        }

        const { token, user } = response.data;

        // Store session info
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('userId', user.id);

        this.toastr.success('Login successful', 'Welcome back');

        // Redirect based on role ONLY
        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (user.role === 'LEARNER') {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/home']);
        }

        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Login failed');
        this.loadingSubject.next(false);
      },
    });
  }

  handleVeridyEmail(data: VerifyEmailRequest): void {
    this.loadingSubject.next(true);

    this.verifyEmail(data).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Email verified');
        this.router.navigate(['/login']);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Email verification failed');
        this.loadingSubject.next(false);
      },
    });
  }

  handleRequestVerificationCode(email: string): void {
    this.loadingSubject.next(true);

    this.requestVerificationCode(email).subscribe({
      next: (response) => {
        this.toastr.success(
          response.message || 'Verification code sent to your email'
        );
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.toastr.error(
          err.error.message || 'Failed to send verification code'
        );
        this.loadingSubject.next(false);
      },
    });
  }

  handleForgotPassword(email: string): void {
    this.loadingSubject.next(true);

    this.forgotPassword(email).subscribe({
      next: (response) => {
        this.toastr.success(
          response.message || 'Password reset code sent to your email'
        );
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.toastr.error(
          err.error.message || 'Failed to send password reset code'
        );
        this.loadingSubject.next(false);
      },
    });
  }

  handleResetPassword(data: ResetPasswordRequest): void {
    this.loadingSubject.next(true);

    this.resetPassword(data).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Password reset successfully');
        this.router.navigate(['/login']);
        this.loadingSubject.next(false);
      },
      error: () => {
        this.toastr.error('Failed to reset password');
        this.loadingSubject.next(false);
      },
    });
  }

  handleResendResetCode(email: string): void {
    this.loadingSubject.next(true);

    this.resendRequestCode(email).subscribe({
      next: () => {
        this.toastr.success('Verification code resent to your email');
        this.loadingSubject.next(false);
      },
      error: () => {
        this.toastr.error('Failed to resend verification code');
        this.loadingSubject.next(false);
      },
    });
  }

  // ==========================
  // HELPERS
  // ==========================

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
