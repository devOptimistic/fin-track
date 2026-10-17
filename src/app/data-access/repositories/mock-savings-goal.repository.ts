import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { SavingsGoal } from '../models/finance.model';
import { SavingsGoalRepository } from './savings-goal.repository';

@Injectable({ providedIn: 'root' })
export class MockSavingsGoalRepository implements SavingsGoalRepository {
  private readonly goals: SavingsGoal[] = [
    {
      id: 'goal-001',
      title: 'خرید لپ‌تاپ',
      targetAmount: 60_000_000,
      currentAmount: 25_000_000,
      targetDate: '2027-03-01',
    },
    {
      id: 'goal-002',
      title: 'سفر به ترکیه',
      targetAmount: 40_000_000,
      currentAmount: 12_000_000,
      targetDate: '2027-06-15',
    },
  ];

  getGoals(): Observable<SavingsGoal[]> {
    return of([...this.goals]).pipe(delay(500));
  }

  addGoal(goal: Omit<SavingsGoal, 'id'>): Observable<SavingsGoal> {
    const created: SavingsGoal = {
      ...goal,
      id: `goal-${crypto.randomUUID()}`,
    };
    this.goals.push(created);
    return of(created).pipe(delay(500));
  }

  updateGoal(id: string, goal: Partial<SavingsGoal>): Observable<SavingsGoal> {
    const index = this.goals.findIndex((item) => item.id === id);
    const updated: SavingsGoal = { ...this.goals[index], ...goal, id };
    this.goals[index] = updated;
    return of(updated).pipe(delay(500));
  }

  deleteGoal(id: string): Observable<void> {
    const index = this.goals.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.goals.splice(index, 1);
    }
    return of(void 0).pipe(delay(500));
  }
}
