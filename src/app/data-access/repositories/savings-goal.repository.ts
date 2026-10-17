import { Observable } from 'rxjs';
import { SavingsGoal } from '../models/finance.model';

export abstract class SavingsGoalRepository {
  abstract getGoals(): Observable<SavingsGoal[]>;
  abstract addGoal(goal: Omit<SavingsGoal, 'id'>): Observable<SavingsGoal>;
  abstract updateGoal(id: string, goal: Partial<SavingsGoal>): Observable<SavingsGoal>;
  abstract deleteGoal(id: string): Observable<void>;
}
