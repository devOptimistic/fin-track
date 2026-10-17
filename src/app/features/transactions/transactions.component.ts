import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { Transaction } from '../../data-access/models/finance.model';
import { TransactionRepository } from '../../data-access/repositories/transaction.repository';
import { TomanPipe } from '../../shared/pipes/toman.pipe';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TransactionFormComponent, DatePipe, TomanPipe],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent {
  private readonly repository = inject(TransactionRepository);

  private readonly categoryLabels: Readonly<Record<string, string>> = {
    'cat-salary': 'حقوق',
    'cat-freelance': 'فریلنس',
    'cat-rent': 'اجاره',
    'cat-food': 'خوراک',
    'cat-utilities': 'قبوض',
    'cat-transport': 'حمل و نقل',
    'cat-entertainment': 'تفریح',
    'cat-other': 'سایر',
  };

  protected readonly refreshTrigger = signal(0);
  protected readonly isFormOpen = signal(false);
  protected readonly loading = signal(true);

  protected readonly transactions = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() => this.repository.getTransactions()),
      tap(() => this.loading.set(false)),
    ),
    { initialValue: [] as Transaction[] },
  );

  protected openForm(): void {
    this.isFormOpen.set(true);
  }

  protected closeForm(): void {
    this.isFormOpen.set(false);
  }

  protected onSave(data: Partial<Transaction>): void {
    const payload: Omit<Transaction, 'id'> = {
      type: data.type ?? 'expense',
      amount: data.amount ?? 0,
      categoryId: data.categoryId ?? '',
      date: data.date ?? new Date().toISOString(),
      description: data.description,
    };

    this.repository.addTransaction(payload).subscribe(() => {
      this.refreshTrigger.update((value) => value + 1);
      this.closeForm();
    });
  }

  protected onDelete(id: string): void {
    this.repository.deleteTransaction(id).subscribe(() => {
      this.refreshTrigger.update((value) => value + 1);
    });
  }

  protected labelFor(categoryId: string): string {
    return this.categoryLabels[categoryId] ?? categoryId;
  }
}
