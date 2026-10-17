import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { Transaction, TransactionType } from '../../data-access/models/finance.model';
import { TransactionRepository } from '../../data-access/repositories/transaction.repository';
import { TomanPipe } from '../../shared/pipes/toman.pipe';

interface ChartSlice {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxEchartsDirective, DatePipe, TomanPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly repository = inject(TransactionRepository);

  private readonly categoryLabels: Readonly<Record<string, string>> = {
    'cat-salary': 'حقوق',
    'cat-freelance': 'فریلنس',
    'cat-rent': 'اجاره',
    'cat-food': 'خوراک',
    'cat-utilities': 'قبوض',
    'cat-transport': 'حمل و نقل',
    'cat-entertainment': 'تفریح',
    'cat-other': 'سایر',
  };

  private readonly palette: ReadonlyArray<string> = [
    '#16a34a',
    '#2563eb',
    '#dc2626',
    '#f59e0b',
    '#6b7280',
    '#8b5cf6',
  ];

  protected readonly transactions = toSignal(this.repository.getTransactions(), {
    initialValue: [] as Transaction[],
  });

  protected readonly totalIncome = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0),
  );

  protected readonly totalExpense = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0),
  );

  protected readonly netBalance = computed(() => this.totalIncome() - this.totalExpense());

  protected readonly trendChartOption = computed<EChartsOption>(() => {
    const transactions = this.transactions();
    const dates = [...new Set(transactions.map((transaction) => transaction.date.slice(0, 10)))].sort();

    const sumByType = (type: TransactionType): number[] =>
      dates.map((date) =>
        transactions
          .filter((transaction) => transaction.type === type && transaction.date.slice(0, 10) === date)
          .reduce((total, transaction) => total + transaction.amount, 0),
      );

    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['درآمد', 'هزینه'], top: 0 },
      grid: { left: 12, right: 12, bottom: 8, top: 40, containLabel: true },
      xAxis: {
        type: 'category',
        data: dates.map((date) => date.slice(5).replace('-', '/')),
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: (value: number) => value.toLocaleString('en-US') },
      },
      series: [
        {
          name: 'درآمد',
          type: 'bar',
          data: sumByType('income'),
          itemStyle: { color: '#16a34a', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 28,
        },
        {
          name: 'هزینه',
          type: 'bar',
          data: sumByType('expense'),
          itemStyle: { color: '#dc2626', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 28,
        },
      ],
    };
  });

  protected readonly categoryChartOption = computed<EChartsOption>(() => {
    const slices = this.transactions()
      .filter((transaction) => transaction.type === 'expense')
      .reduce<ChartSlice[]>((groups, transaction) => {
        const name = this.labelFor(transaction.categoryId);
        const group = groups.find((item) => item.name === name);

        if (group) {
          group.value += transaction.amount;
        } else {
          groups.push({ name, value: transaction.amount });
        }

        return groups;
      }, [])
      .map((slice, index) => ({
        ...slice,
        itemStyle: { color: this.palette[index % this.palette.length] },
      }));

    return {
      tooltip: {
        trigger: 'item',
        valueFormatter: (value) => `${Number(value).toLocaleString('en-US')} تومان`,
      },
      legend: { bottom: 0, icon: 'circle' },
      series: [
        {
          name: 'توزیع هزینه‌ها',
          type: 'pie',
          radius: ['55%', '75%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: '#ffffff', borderWidth: 2, borderRadius: 6 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
          data: slices,
        },
      ],
    };
  });

  protected labelFor(categoryId: string): string {
    return this.categoryLabels[categoryId] ?? categoryId;
  }
}
