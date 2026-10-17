import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { SavingsGoal } from '../../data-access/models/finance.model';
import { SavingsGoalRepository } from '../../data-access/repositories/savings-goal.repository';
import { TomanPipe } from '../../shared/pipes/toman.pipe';
import { SavingsGoalFormComponent } from './savings-goal-form/savings-goal-form.component';

interface GoalProgress extends SavingsGoal {
  percentage: number;
}

@Component({
  selector: 'app-savings-goals',
  standalone: true,
  imports: [SavingsGoalFormComponent, DatePipe, TomanPipe],
  templateUrl: './savings-goals.component.html',
})
export class SavingsGoalsComponent {
  private readonly repository = inject(SavingsGoalRepository);

  protected readonly refreshTrigger = signal(0);
  protected readonly isFormOpen = signal(false);
  protected readonly loading = signal(true);

  protected readonly goals = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() => this.repository.getGoals()),
      tap(() => this.loading.set(false)),
    ),
    { initialValue: [] as SavingsGoal[] },
  );

  protected readonly goalsProgress = computed<GoalProgress[]>(() =>
    this.goals().map((goal) => ({
      ...goal,
      percentage: Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)),
    })),
  );

  protected openForm(): void {
    this.isFormOpen.set(true);
  }

  protected closeForm(): void {
    this.isFormOpen.set(false);
  }

  protected onSave(data: Partial<SavingsGoal>): void {
    const payload: Omit<SavingsGoal, 'id'> = {
      title: data.title ?? '',
      targetAmount: data.targetAmount ?? 0,
      currentAmount: data.currentAmount ?? 0,
      targetDate: data.targetDate ?? new Date().toISOString(),
    };

    this.repository.addGoal(payload).subscribe(() => {
      this.refreshTrigger.update((value) => value + 1);
      this.closeForm();
    });
  }

  protected onDelete(id: string): void {
    this.repository.deleteGoal(id).subscribe(() => {
      this.refreshTrigger.update((value) => value + 1);
    });
  }

  protected onAddFunds(goalId: string, currentAmount: number, amountToAdd: string): void {
    const delta = Number(amountToAdd);

    if (!Number.isFinite(delta) || delta <= 0) {
      return;
    }

    this.repository.updateGoal(goalId, { currentAmount: currentAmount + delta }).subscribe(() => {
      this.refreshTrigger.update((value) => value + 1);
    });
  }
}
