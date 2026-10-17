import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface NavItem {
  readonly label: string;
  readonly route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  host: { class: 'block h-full' },
  template: `
    <aside class="flex h-full w-full flex-col bg-gray-900 text-white">
      <div class="flex h-16 items-center border-b border-gray-800 px-6">
        <span class="text-2xl font-bold tracking-tight text-green-500">FinTrack</span>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="ناوبری اصلی">
        <ul class="space-y-1">
          @for (item of navItems; track item.label) {
            <li>
              <a
                [routerLink]="item.route"
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
  protected readonly navItems: ReadonlyArray<NavItem> = [
    { label: 'داشبورد', route: '/dashboard' },
    { label: 'تراکنش‌ها', route: '/transactions' },
    { label: 'دسته‌بندی‌ها', route: '/categories' },
    { label: 'بودجه‌بندی', route: '/budgets' },
    { label: 'اهداف', route: '/' },
    { label: 'تنظیمات', route: '/' },
  ];
}
