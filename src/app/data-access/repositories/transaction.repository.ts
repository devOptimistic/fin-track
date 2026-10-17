import { Observable } from 'rxjs';
import { Transaction } from '../models/finance.model';

export abstract class TransactionRepository {
  abstract getTransactions(): Observable<Transaction[]>;
  abstract addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction>;
  abstract updateTransaction(id: string, transaction: Partial<Transaction>): Observable<Transaction>;
  abstract deleteTransaction(id: string): Observable<void>;
}
