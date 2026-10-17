import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, TransactionType } from '../../../data-access/models/finance.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl"
    >
      <h2 class="text-lg font-semibold text-gray-800">افزودن دسته‌بندی جدید</h2>

      <div>
        <label for="name" class="mb-1 block text-sm font-medium text-gray-700">نام دسته‌بندی</label>
        <input
          id="name"
          type="text"
          formControlName="name"
          placeholder="مثلاً خوراک"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        @if (form.controls.name.touched && form.controls.name.invalid) {
          <p class="mt-1 text-xs text-red-500">نام دسته‌بندی الزامی است.</p>
        }
      </div>

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
export class CategoryFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly save = output<Partial<Category>>();
  readonly cancel = output<void>();

  protected readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required]),
    type: this.fb.nonNullable.control<TransactionType>('expense', [Validators.required]),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      name: value.name.trim(),
      type: value.type,
    });
  }
}
