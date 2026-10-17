import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEchartsCore } from 'ngx-echarts';
import { routes } from './app.routes';
import { TransactionRepository } from './data-access/repositories/transaction.repository';
import { MockTransactionRepository } from './data-access/repositories/mock-transaction.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideEchartsCore({ echarts: () => import('echarts') }),
    { provide: TransactionRepository, useClass: MockTransactionRepository },
  ],
};
