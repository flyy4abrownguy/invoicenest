import { createClient } from '@/lib/supabase/server';
import { Expense, ExpenseCategory } from '../types';

// Expense Categories
export async function getExpenseCategories(userId: string): Promise<ExpenseCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createExpenseCategory(
  category: Omit<ExpenseCategory, 'id' | 'created_at'>
): Promise<ExpenseCategory> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expense_categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createDefaultExpenseCategories(userId: string): Promise<void> {
  const defaultCategories = [
    { name: 'Office Supplies', description: 'Office equipment and supplies', color: '#3B82F6' },
    { name: 'Software & Tools', description: 'Software subscriptions and tools', color: '#8B5CF6' },
    { name: 'Marketing', description: 'Marketing and advertising expenses', color: '#EC4899' },
    { name: 'Travel', description: 'Travel and accommodation', color: '#F59E0B' },
    { name: 'Utilities', description: 'Internet, phone, electricity', color: '#10B981' },
    { name: 'Professional Services', description: 'Legal, accounting, consulting', color: '#6366F1' },
    { name: 'Other', description: 'Miscellaneous expenses', color: '#6B7280' },
  ];

  const supabase = await createClient();

  await supabase
    .from('expense_categories')
    .insert(defaultCategories.map((cat) => ({ ...cat, user_id: userId })));
}

// Expenses
export async function getExpenses(
  userId: string,
  filters?: {
    categoryId?: string;
    clientId?: string;
    isBillable?: boolean;
    isBilled?: boolean;
    startDate?: string;
    endDate?: string;
  }
): Promise<Expense[]> {
  const supabase = await createClient();

  let query = supabase
    .from('expenses')
    .select(`
      *,
      category:expense_categories(*),
      client:clients(*)
    `)
    .eq('user_id', userId);

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.clientId) {
    query = query.eq('client_id', filters.clientId);
  }

  if (filters?.isBillable !== undefined) {
    query = query.eq('is_billable', filters.isBillable);
  }

  if (filters?.isBilled !== undefined) {
    query = query.eq('is_billed', filters.isBilled);
  }

  if (filters?.startDate) {
    query = query.gte('expense_date', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('expense_date', filters.endDate);
  }

  query = query.order('expense_date', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getExpenseById(id: string, userId: string): Promise<Expense | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      category:expense_categories(*),
      client:clients(*)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function createExpense(
  expense: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'category' | 'client'>
): Promise<Expense> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('expenses').insert(expense).select().single();

  if (error) throw error;
  return getExpenseById(data.id, expense.user_id) as Promise<Expense>;
}

export async function updateExpense(
  id: string,
  userId: string,
  updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'category' | 'client'>>
): Promise<Expense> {
  const supabase = await createClient();

  const { error } = await supabase.from('expenses').update(updates).eq('id', id).eq('user_id', userId);

  if (error) throw error;
  return getExpenseById(id, userId) as Promise<Expense>;
}

export async function deleteExpense(id: string, userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('expenses').delete().eq('id', id).eq('user_id', userId);

  if (error) throw error;
}

export async function getExpenseStats(userId: string): Promise<{
  total: number;
  billable: number;
  billed: number;
  unbilled: number;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expenses')
    .select('amount, is_billable, is_billed')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = (data || []).reduce(
    (acc, expense) => {
      acc.total += expense.amount;
      if (expense.is_billable) {
        acc.billable += expense.amount;
        if (expense.is_billed) {
          acc.billed += expense.amount;
        } else {
          acc.unbilled += expense.amount;
        }
      }
      return acc;
    },
    { total: 0, billable: 0, billed: 0, unbilled: 0 }
  );

  return stats;
}
