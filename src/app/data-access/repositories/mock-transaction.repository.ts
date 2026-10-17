import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Transaction } from '../models/finance.model';
import { TransactionRepository } from './transaction.repository';

@Injectable({ providedIn: 'root' })
export class MockTransactionRepository implements TransactionRepository {
  private readonly transactions: Transaction[] = [
    {
      id: 'txn-001',
      amount: 12_500_000,
      type: 'income',
      categoryId: 'cat-salary',
      date: '2026-10-01T08:30:00.000Z',
      description: 'حقوق مهرماه',
    },
    {
      id: 'txn-002',
      amount: 2_500_000,
      type: 'expense',
      categoryId: 'cat-rent',
      date: '2026-10-03T10:15:00.000Z',
      description: 'اجاره خانه',
    },
    {
      id: 'txn-003',
      amount: 820_000,
      type: 'expense',
      categoryId: 'cat-food',
      date: '2026-10-08T18:45:00.000Z',
      description: 'خرید سوپرمارکت',
    },
    {
      id: 'txn-004',
      amount: 3_400_000,
      type: 'income',
      categoryId: 'cat-freelance',
      date: '2026-10-11T13:05:00.000Z',
      description: 'فروش پروژه فریلنس',
    },
    {
      id: 'txn-005',
      amount: 460_000,
      type: 'expense',
      categoryId: 'cat-utilities',
      date: '2026-10-14T20:00:00.000Z',
      description: 'قبض برق و گاز',
    },
  ];

  getTransactions(): Observable<Transaction[]> {
    return of([...this.transactions]).pipe(delay(500));
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    const created: Transaction = {
      ...transaction,
      id: this.generateId(),
    };
    this.transactions.push(created);
    return of(created).pipe(delay(500));
  }

  updateTransaction(id: string, transaction: Partial<Transaction>): Observable<Transaction> {
    const index = this.transactions.findIndex((item) => item.id === id);
    const updated: Transaction = { ...this.transactions[index], ...transaction, id };
    this.transactions[index] = updated;
    return of(updated).pipe(delay(500));
  }

  deleteTransaction(id: string): Observable<void> {
    const index = this.transactions.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
    }
    return of(void 0).pipe(delay(500));
  }

  private generateId(): string {
    return `txn-${crypto.randomUUID()}`;
  }
}
