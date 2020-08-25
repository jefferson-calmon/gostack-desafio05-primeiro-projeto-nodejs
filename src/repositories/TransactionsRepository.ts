import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface TransactionsAndBalance {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): TransactionsAndBalance {
    const transactionsAndBalance = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };

    return transactionsAndBalance;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((sum, transaction) => {
      return transaction.type === 'income' ? sum + transaction.value : sum + 0;
    }, 0);

    const outcome = this.transactions.reduce((sum, transaction) => {
      return transaction.type === 'outcome' ? sum + transaction.value : sum + 0;
    }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public create(data: CreateTransactionDTO): Transaction {
    const { title, value, type } = data;

    const { total } = this.getBalance();

    if (total < value && type === 'outcome') {
      throw Error('Saldo insuficiente');
    }

    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
