import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Category } from '../../data-access/models/finance.model';
import { CategoryRepository } from '../../data-access/repositories/category.repository';
import { CategoryFormComponent } from './category-form/category-form.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CategoryFormComponent],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {
  private readonly repository = inject(CategoryRepository);

  protected readonly refreshTrigger = signal(0);
  protected readonly isFormOpen = signal(false);

  protected readonly categories = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() => this.repository.getCategories()),
    ),
    { initialValue: [] as Category[] },
  );

  protected openForm(): void {
    this.isFormOpen.set(true);
  }

  protected closeForm(): void {
    this.isFormOpen.set(false);
  }

  protected onSave(data: Partial<Category>): void {
    const payload: Omit<Category, 'id'> = {
      name: data.name ?? '',
      type: data.type ?? 'expense',
      icon: data.icon,
      color: data.color,
    };

    this.repository.addCategory(payload).subscribe(() => {
      this.refreshTrigger.update((value) => value + 1);
      this.closeForm();
    });
  }

  protected onDelete(id: string): void {
    this.repository.deleteCategory(id).subscribe(() => {
      this.refreshTrigger.update((value) => value + 1);
    });
  }
}
