import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-gray-800">ثبت‌نام در فین‌ترک</h1>
          <p class="mt-2 text-sm text-gray-500">برای شروع، اطلاعات خود را وارد کنید.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="fullName" class="mb-1 block text-sm font-medium text-gray-700">نام و نام خانوادگی</label>
            <input
              id="fullName"
              type="text"
              formControlName="fullName"
              autocomplete="name"
              placeholder="نام کامل"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            @if (form.controls.fullName.touched && form.controls.fullName.invalid) {
              <p class="mt-1 text-xs text-red-500">نام کامل الزامی است.</p>
            }
          </div>

          <div>
            <label for="email" class="mb-1 block text-sm font-medium text-gray-700">ایمیل</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <p class="mt-1 text-xs text-red-500">ایمیل معتبر الزامی است.</p>
            }
          </div>

          <div>
            <label for="password" class="mb-1 block text-sm font-medium text-gray-700">رمز عبور</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              autocomplete="new-password"
              placeholder="••••••••"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            @if (form.controls.password.touched && form.controls.password.invalid) {
              <p class="mt-1 text-xs text-red-500">رمز عبور باید حداقل ۶ کاراکتر باشد.</p>
            }
          </div>

          @if (errorMessage()) {
            <p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{{ errorMessage() }}</p>
          }

          <button
            type="submit"
            [disabled]="isLoading()"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            @if (isLoading()) {
              <span
                class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
              ></span>
            }
            ثبت‌نام
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          قبلاً ثبت‌نام کرده‌اید؟
          <a routerLink="/login" class="font-medium text-green-600 hover:text-green-700">
            وارد شوید
          </a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    fullName: this.fb.nonNullable.control('', [Validators.required]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  protected onSubmit(): void {
    if (this.form.invalid || this.isLoading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        void this.router.navigate(['/']);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.errorMessage.set(error instanceof Error ? error.message : 'ثبت‌نام ناموفق بود.');
      },
    });
  }
}
