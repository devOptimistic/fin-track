import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <header
      class="flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          (click)="toggleSidebar.emit()"
          class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
          aria-label="باز کردن منو"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <h1 class="text-lg font-semibold text-gray-800">داشبورد</h1>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <span class="hidden text-sm font-medium text-gray-700 sm:block">
            {{ authService.currentUser()?.fullName }}
          </span>
          <span
            class="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white"
          >
            {{ authService.currentUser()?.fullName?.charAt(0) || 'م' }}
          </span>
        </div>

        <button
          type="button"
          (click)="authService.logout()"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600"
        >
          خروج
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);

  readonly toggleSidebar = output<void>();
}
