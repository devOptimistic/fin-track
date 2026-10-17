import { Observable } from 'rxjs';
import { Budget } from '../models/finance.model';

export abstract class BudgetRepository {
  abstract getBudgets(): Observable<Budget[]>;
  abstract addBudget(budget: Omit<Budget, 'id'>): Observable<Budget>;
  abstract deleteBudget(id: string): Observable<void>;
}
