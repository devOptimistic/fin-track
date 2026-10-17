import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <header
      class="flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm"
    >
      <h1 class="text-lg font-semibold text-gray-800">داشبورد</h1>

      <button
        type="button"
        class="flex items-center gap-3 rounded-full outline-none focus:ring-2 focus:ring-green-500"
        aria-label="حساب کاربری"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white"
        >
          م
        </span>
      </button>
    </header>
  `,
})
export class HeaderComponent {}
