import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SavingsGoal } from '../../../data-access/models/finance.model';

@Component({
  selector: 'app-savings-goal-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl"
    >
      <h2 class="text-lg font-semibold text-gray-800">تعریف هدف جدید</h2>

      <div>
        <label for="title" class="mb-1 block text-sm font-medium text-gray-700">عنوان هدف</label>
        <input
          id="title"
          type="text"
          formControlName="title"
          placeholder="مثلاً خرید لپ‌تاپ"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        @if (form.controls.title.touched && form.controls.title.invalid) {
          <p class="mt-1 text-xs text-red-500">عنوان هدف الزامی است.</p>
        }
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="targetAmount" class="mb-1 block text-sm font-medium text-gray-700">مبلغ هدف</label>
          <input
            id="targetAmount"
            type="number"
            min="1"
            formControlName="targetAmount"
            placeholder="0"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          @if (form.controls.targetAmount.touched && form.controls.targetAmount.invalid) {
            <p class="mt-1 text-xs text-red-500">مبلغ هدف باید حداقل ۱ باشد.</p>
          }
        </div>

        <div>
          <label for="currentAmount" class="mb-1 block text-sm font-medium text-gray-700">مبلغ پس‌انداز شده</label>
          <input
            id="currentAmount"
            type="number"
            min="0"
            formControlName="currentAmount"
            placeholder="0"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          @if (form.controls.currentAmount.touched && form.controls.currentAmount.invalid) {
            <p class="mt-1 text-xs text-red-500">مبلغ نمی‌تواند منفی باشد.</p>
          }
        </div>
      </div>

      <div>
        <label for="targetDate" class="mb-1 block text-sm font-medium text-gray-700">تاریخ هدف</label>
        <input
          id="targetDate"
          type="date"
          formControlName="targetDate"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        @if (form.controls.targetDate.touched && form.controls.targetDate.invalid) {
          <p class="mt-1 text-xs text-red-500">تاریخ هدف الزامی است.</p>
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
          ثبت هدف
        </button>
      </div>
    </form>
  `,
})
export class SavingsGoalFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly save = output<Partial<SavingsGoal>>();
  readonly cancel = output<void>();

  protected readonly form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [Validators.required]),
    targetAmount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
    currentAmount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
    targetDate: this.fb.nonNullable.control('', [Validators.required]),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      title: value.title.trim(),
      targetAmount: value.targetAmount,
      currentAmount: value.currentAmount,
      targetDate: value.targetDate,
    });
  }
}
