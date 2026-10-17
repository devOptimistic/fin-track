export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

export interface Transaction {
  id: string;
  amount: number; // Stored in base unit (e.g., Toman/Rial)
  type: TransactionType;
  categoryId: string;
  date: string; // ISO 8601 string
  description?: string;
}
