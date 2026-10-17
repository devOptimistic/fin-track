import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen w-full overflow-hidden bg-gray-50">
      @if (isSidebarOpen()) {
        <div
          class="fixed inset-0 z-40 bg-black/50 md:hidden"
          (click)="closeSidebar()"
          aria-hidden="true"
        ></div>
      }

      <app-sidebar
        class="w-64 flex-shrink-0"
        [isOpen]="isSidebarOpen()"
        (closeSidebar)="closeSidebar()"
      ></app-sidebar>

      <div class="flex flex-1 flex-col overflow-hidden">
        <app-header (toggleSidebar)="toggleSidebar()"></app-header>

        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  protected readonly isSidebarOpen = signal(false);

  protected toggleSidebar(): void {
    this.isSidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
