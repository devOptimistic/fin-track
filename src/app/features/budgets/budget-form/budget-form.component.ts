import { Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Budget, Category } from '../../../data-access/models/finance.model';
import { CategoryRepository } from '../../../data-access/repositories/category.repository';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl"
    >
      <h2 class="text-lg font-semibold text-gray-800">تعریف بودجه جدید</h2>

      <div>
        <label for="categoryId" class="mb-1 block text-sm font-medium text-gray-700">دسته‌بندی</label>
        <select
          id="categoryId"
          formControlName="categoryId"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="" disabled>انتخاب دسته‌بندی</option>
          @for (category of expenseCategories(); track category.id) {
            <option [value]="category.id">{{ category.name }}</option>
          }
        </select>
        @if (form.controls.categoryId.touched && form.controls.categoryId.invalid) {
          <p class="mt-1 text-xs text-red-500">انتخاب دسته‌بندی الزامی است.</p>
        }
      </div>

      <div>
        <label for="amount" class="mb-1 block text-sm font-medium text-gray-700">مبلغ بودجه</label>
        <input
          id="amount"
          type="number"
          min="1"
          formControlName="amount"
          placeholder="0"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        @if (form.controls.amount.touched && form.controls.amount.invalid) {
          <p class="mt-1 text-xs text-red-500">مبلغ باید حداقل ۱ باشد.</p>
        }
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          (click)="cancel.emit()"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          انصراف
        </button>
        <button
          type="submit"
          class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          ثبت
        </button>
      </div>
    </form>
  `,
})
export class BudgetFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryRepository = inject(CategoryRepository);

  readonly save = output<Partial<Budget>>();
  readonly cancel = output<void>();

  protected readonly categories = toSignal(this.categoryRepository.getCategories(), {
    initialValue: [] as Category[],
  });

  protected readonly expenseCategories = computed(() =>
    this.categories().filter((category) => category.type === 'expense'),
  );

  protected readonly form = this.fb.nonNullable.group({
    categoryId: this.fb.nonNullable.control('', [Validators.required]),
    amount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      categoryId: value.categoryId,
      amount: value.amount,
    });
  }
}
