import { Component, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Transaction, TransactionType } from '../../../data-access/models/finance.model';
import { CategoryRepository } from '../../../data-access/repositories/category.repository';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl"
    >
      <h2 class="text-lg font-semibold text-gray-800">ثبت تراکنش جدید</h2>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="type" class="mb-1 block text-sm font-medium text-gray-700">نوع</label>
          <select
            id="type"
            formControlName="type"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="expense">هزینه</option>
            <option value="income">درآمد</option>
          </select>
        </div>

        <div>
          <label for="amount" class="mb-1 block text-sm font-medium text-gray-700">مبلغ</label>
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

        <div>
          <label for="categoryId" class="mb-1 block text-sm font-medium text-gray-700">دسته‌بندی</label>
          <select
            id="categoryId"
            formControlName="categoryId"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="" disabled>انتخاب دسته‌بندی</option>
            @for (category of categories(); track category.id) {
              <option [value]="category.id">{{ category.name }}</option>
            }
          </select>
          @if (form.controls.categoryId.touched && form.controls.categoryId.invalid) {
            <p class="mt-1 text-xs text-red-500">انتخاب دسته‌بندی الزامی است.</p>
          }
        </div>

        <div>
          <label for="date" class="mb-1 block text-sm font-medium text-gray-700">تاریخ</label>
          <input
            id="date"
            type="date"
            formControlName="date"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          @if (form.controls.date.touched && form.controls.date.invalid) {
            <p class="mt-1 text-xs text-red-500">تاریخ الزامی است.</p>
          }
        </div>
      </div>

      <div>
        <label for="description" class="mb-1 block text-sm font-medium text-gray-700">توضیحات</label>
        <input
          id="description"
          type="text"
          formControlName="description"
          placeholder="اختیاری"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
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
export class TransactionFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryRepository = inject(CategoryRepository);

  readonly save = output<Partial<Transaction>>();
  readonly cancel = output<void>();

  protected readonly categories = toSignal(this.categoryRepository.getCategories(), {
    initialValue: [] as Category[],
  });

  protected readonly form = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<TransactionType>('expense', [Validators.required]),
    amount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
    categoryId: this.fb.nonNullable.control('', [Validators.required]),
    date: this.fb.nonNullable.control('', [Validators.required]),
    description: this.fb.nonNullable.control(''),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      type: value.type,
      amount: value.amount,
      categoryId: value.categoryId,
      date: value.date,
      description: value.description || undefined,
    });
  }
}
