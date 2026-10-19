import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEchartsCore } from 'ngx-echarts';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { TransactionRepository } from './data-access/repositories/transaction.repository';
import { MockTransactionRepository } from './data-access/repositories/mock-transaction.repository';
import { CategoryRepository } from './data-access/repositories/category.repository';
import { MockCategoryRepository } from './data-access/repositories/mock-category.repository';
import { BudgetRepository } from './data-access/repositories/budget.repository';
import { MockBudgetRepository } from './data-access/repositories/mock-budget.repository';
import { SavingsGoalRepository } from './data-access/repositories/savings-goal.repository';
import { MockSavingsGoalRepository } from './data-access/repositories/mock-savings-goal.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEchartsCore({ echarts: () => import('echarts') }),
    { provide: TransactionRepository, useClass: MockTransactionRepository },
    { provide: CategoryRepository, useClass: MockCategoryRepository },
    { provide: BudgetRepository, useClass: MockBudgetRepository },
    { provide: SavingsGoalRepository, useClass: MockSavingsGoalRepository },
  ],
};
