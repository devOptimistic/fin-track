import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

interface NavItem {
  readonly label: string;
  readonly route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  host: {
    class:
      'fixed inset-y-0 right-0 z-50 block w-64 transform transition-transform duration-300 md:relative md:translate-x-0 md:pointer-events-auto',
    '[class.translate-x-full]': '!isOpen()',
    '[class.pointer-events-none]': '!isOpen()',
  },
  template: `
    <aside class="relative flex h-full w-full flex-col bg-gray-900 text-white">
      <div class="flex h-16 items-center justify-between border-b border-gray-800 px-6">
        <span class="text-2xl font-bold tracking-tight text-green-500">FinTrack</span>

        <button
          type="button"
          (click)="closeSidebar.emit()"
          class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white md:hidden"
          aria-label="بستن منو"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="ناوبری اصلی">
        <ul class="space-y-1">
          @for (item of navItems; track item.label) {
            <li>
              <a
                [routerLink]="item.route"
                (click)="closeSidebar.emit()"
                class="block rounded-lg px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                {{ item.label }}
              </a>
            </li>
          }
        </ul>
      </nav>
    </aside>
  `,
})
export class SidebarComponent {
  readonly isOpen = input(false);
  readonly closeSidebar = output<void>();

  protected readonly navItems: ReadonlyArray<NavItem> = [
    { label: 'داشبورد', route: '/dashboard' },
    { label: 'تراکنش‌ها', route: '/transactions' },
    { label: 'دسته‌بندی‌ها', route: '/categories' },
    { label: 'بودجه‌بندی', route: '/budgets' },
    { label: 'اهداف', route: '/savings-goals' },
    { label: 'تنظیمات', route: '/' },
  ];
}
