import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEchartsCore } from 'ngx-echarts';
import { routes } from './app.routes';
import { TransactionRepository } from './data-access/repositories/transaction.repository';
import { MockTransactionRepository } from './data-access/repositories/mock-transaction.repository';
import { CategoryRepository } from './data-access/repositories/category.repository';
import { MockCategoryRepository } from './data-access/repositories/mock-category.repository';
import { BudgetRepository } from './data-access/repositories/budget.repository';
import { MockBudgetRepository } from './data-access/repositories/mock-budget.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideEchartsCore({ echarts: () => import('echarts') }),
    { provide: TransactionRepository, useClass: MockTransactionRepository },
    { provide: CategoryRepository, useClass: MockCategoryRepository },
    { provide: BudgetRepository, useClass: MockBudgetRepository },
  ],
};
