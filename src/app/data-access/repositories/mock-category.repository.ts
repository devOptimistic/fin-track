import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Category } from '../models/finance.model';
import { CategoryRepository } from './category.repository';

@Injectable({ providedIn: 'root' })
export class MockCategoryRepository implements CategoryRepository {
  private readonly categories: Category[] = [
    {
      id: 'cat-food',
      name: 'خوراک',
      type: 'expense',
      icon: 'restaurant',
      color: '#16a34a',
    },
    {
      id: 'cat-transport',
      name: 'حمل و نقل',
      type: 'expense',
      icon: 'directions_car',
      color: '#2563eb',
    },
    {
      id: 'cat-rent',
      name: 'اجاره',
      type: 'expense',
      icon: 'home',
      color: '#dc2626',
    },
    {
      id: 'cat-utilities',
      name: 'قبوض',
      type: 'expense',
      icon: 'receipt',
      color: '#f59e0b',
    },
    {
      id: 'cat-entertainment',
      name: 'تفریح',
      type: 'expense',
      icon: 'movie',
      color: '#8b5cf6',
    },
    {
      id: 'cat-salary',
      name: 'حقوق',
      type: 'income',
      icon: 'payments',
      color: '#16a34a',
    },
    {
      id: 'cat-freelance',
      name: 'فریلنس',
      type: 'income',
      icon: 'work',
      color: '#0d9488',
    },
    {
      id: 'cat-other',
      name: 'سایر',
      type: 'expense',
      icon: 'category',
      color: '#6b7280',
    },
  ];

  getCategories(): Observable<Category[]> {
    return of([...this.categories]).pipe(delay(500));
  }

  addCategory(category: Omit<Category, 'id'>): Observable<Category> {
    const created: Category = {
      ...category,
      id: this.generateId(),
    };
    this.categories.push(created);
    return of(created).pipe(delay(500));
  }

  deleteCategory(id: string): Observable<void> {
    const index = this.categories.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.categories.splice(index, 1);
    }
    return of(void 0).pipe(delay(500));
  }

  private generateId(): string {
    return `cat-${crypto.randomUUID()}`;
  }
}
