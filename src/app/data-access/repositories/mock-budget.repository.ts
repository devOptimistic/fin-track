import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Budget } from '../models/finance.model';
import { BudgetRepository } from './budget.repository';

@Injectable({ providedIn: 'root' })
export class MockBudgetRepository implements BudgetRepository {
  private readonly budgets: Budget[] = [
    {
      id: 'bud-001',
      categoryId: 'cat-food',
      amount: 1_000_000,
      month: 10,
      year: 2026,
    },
    {
      id: 'bud-002',
      categoryId: 'cat-rent',
      amount: 2_500_000,
      month: 10,
      year: 2026,
    },
  ];

  getBudgets(): Observable<Budget[]> {
    return of([...this.budgets]).pipe(delay(500));
  }

  addBudget(budget: Omit<Budget, 'id'>): Observable<Budget> {
    const created: Budget = {
      ...budget,
      id: `bud-${crypto.randomUUID()}`,
    };
    this.budgets.push(created);
    return of(created).pipe(delay(500));
  }

  deleteBudget(id: string): Observable<void> {
    const index = this.budgets.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.budgets.splice(index, 1);
    }
    return of(void 0).pipe(delay(500));
  }
}
