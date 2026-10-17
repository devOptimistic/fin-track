import { Observable } from 'rxjs';
import { Category } from '../models/finance.model';

export abstract class CategoryRepository {
  abstract getCategories(): Observable<Category[]>;
  abstract addCategory(category: Omit<Category, 'id'>): Observable<Category>;
  abstract deleteCategory(id: string): Observable<void>;
}
