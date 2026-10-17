import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Budget, Category, Transaction } from '../../data-access/models/finance.model';
import { BudgetRepository } from '../../data-access/repositories/budget.repository';
import { CategoryRepository } from '../../data-access/repositories/category.repository';
import { TransactionRepository } from '../../data-access/repositories/transaction.repository';
import { BudgetFormComponent } from './budget-form/budget-form.component';

interface BudgetProgress extends Budget {
  categoryName: string;
  spent: number;
  remaining: number;
  percentage: number;
}

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [BudgetFormComponent, DecimalPipe],
  templateUrl: './budgets.component.html',
})
export class BudgetsComponent {
  private readonly budgetRepository = inject(BudgetRepository);
  private readonly categoryRepository = inject(CategoryRepository);
  private readonly transactionRepository = inject(TransactionRepository);

  protected readonly refreshTrigger = signal(0);
  protected readonly isFormOpen = signal(false);

  protected readonly budgets = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() => this.budgetRepository.getBudgets()),
    ),
    { initialValue: [] as Budget[] },
  );

  protected readonly categories = toSignal(this.categoryRepository.getCategories(), {
    initialValue: [] as Category[],
  });

  protected readonly transactions = toSignal(this.transactionRepository.getTransactions(), {
    initialValue: [] as Transaction[],
  });

  protected readonly budgetProgress = computed<BudgetProgress[]>(() => {
    const allBudgets = this.budgets();
    const allCategories = this.categories();
    const allTransactions = this.transactions();

    return allBudgets.map((budget) => {
      const category = allCategories.find((item) => item.id === budget.categoryId);

      const spent = allTransactions
        .filter(
          (transaction) =>
            transaction.categoryId === budget.categoryId && transaction.type === 'expense',
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const remaining = Math.max(0, budget.amount - spent);
      const percentage = Math.min(100, Math.round((spent / budget.amount) * 100));

      return {
        ...budget,
        categoryName: category?.name || 'نامشخص',
        spent,
        remaining,
        percentage,
      };
    });
  });

  protected openForm(): void {
    this.isFormOpen.set(true);
  }

  protected closeForm(): void {
    this.isFormOpen.set(false);
  }

  protected onSave(data: Partial<Budget>): void {
    const now = new Date();
    const payload: Omit<Budget, 'id'> = {
      categoryId: data.categoryId ?? '',
      amount: data.amount ?? 0,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };

    this.budgetRepository.addBudget(payload).subscribe(() => {
      this.refreshTrigger.update((value) => value + 1);
      this.closeForm();
    });
  }

  protected onDelete(id: string): void {
    this.budgetRepository.deleteBudget(id).subscribe(() => {
      this.refreshTrigger.update((value) => value + 1);
    });
  }
}
