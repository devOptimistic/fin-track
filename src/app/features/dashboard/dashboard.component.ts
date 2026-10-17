import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import type { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

type TransactionType = 'income' | 'expense';

interface Transaction {
  readonly id: number;
  readonly title: string;
  readonly amount: number;
  readonly date: string;
  readonly type: TransactionType;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxEchartsDirective, CurrencyPipe, DecimalPipe, DatePipe],
  template: `
    <section class="space-y-6">
      <!-- Summary cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article class="rounded-xl bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-gray-500">کل درآمد</p>
          <p class="mt-2 text-2xl font-bold text-green-600">
            {{ totalIncome() | number }}
            <span class="text-sm font-normal text-gray-400">تومان</span>
          </p>
        </article>

        <article class="rounded-xl bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-gray-500">کل هزینه</p>
          <p class="mt-2 text-2xl font-bold text-red-600">
            {{ totalExpense() | number }}
            <span class="text-sm font-normal text-gray-400">تومان</span>
          </p>
        </article>

        <article class="rounded-xl bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-gray-500">مانده حساب</p>
          <p class="mt-2 text-2xl font-bold text-blue-600">
            {{ netBalance() | number }}
            <span class="text-sm font-normal text-gray-400">تومان</span>
          </p>
        </article>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article class="rounded-xl bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-base font-semibold text-gray-800">روند مالی</h2>
          <div echarts [options]="trendChartOption" class="h-72 w-full"></div>
        </article>

        <article class="rounded-xl bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-base font-semibold text-gray-800">توزیع هزینه‌ها</h2>
          <div echarts [options]="categoryChartOption" class="h-72 w-full"></div>
        </article>
      </div>

      <!-- Recent transactions -->
      <article class="rounded-xl bg-white shadow-sm">
        <h2 class="border-b border-gray-100 px-6 py-4 text-base font-semibold text-gray-800">
          آخرین تراکنش‌ها
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-sm">
            <thead>
              <tr class="text-gray-500">
                <th class="px-6 py-3 font-medium">عنوان</th>
                <th class="px-6 py-3 font-medium">تاریخ</th>
                <th class="px-6 py-3 font-medium">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              @for (transaction of transactions(); track transaction.id) {
                <tr class="border-t border-gray-100 transition-colors hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-gray-800">
                    {{ transaction.title }}
                  </td>
                  <td class="px-6 py-4 text-gray-500">
                    {{ transaction.date | date: 'yyyy/MM/dd' }}
                  </td>
                  <td
                    class="px-6 py-4 font-semibold"
                    [class.text-green-600]="transaction.type === 'income'"
                    [class.text-red-600]="transaction.type === 'expense'"
                  >
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount | number }}
                    <span class="text-xs font-normal text-gray-400">تومان</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `,
})
export class DashboardComponent {
  protected readonly totalIncome = signal(12_500_000);
  protected readonly totalExpense = signal(8_200_000);
  protected readonly netBalance = computed(() => this.totalIncome() - this.totalExpense());

  protected readonly transactions = signal<ReadonlyArray<Transaction>>([
    { id: 1, title: 'حقوق مهرماه', amount: 12_500_000, date: '2026-10-01', type: 'income' },
    { id: 2, title: 'اجاره خانه', amount: 2_500_000, date: '2026-10-03', type: 'expense' },
    { id: 3, title: 'خرید سوپرمارکت', amount: 820_000, date: '2026-10-08', type: 'expense' },
    { id: 4, title: 'فروش پروژه فریلنس', amount: 3_400_000, date: '2026-10-11', type: 'income' },
    { id: 5, title: 'قبض برق و گاز', amount: 460_000, date: '2026-10-14', type: 'expense' },
  ]);

  protected readonly trendChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['درآمد', 'هزینه'], top: 0 },
    grid: { left: 12, right: 12, bottom: 8, top: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
    },
    yAxis: { type: 'value', axisLabel: { formatter: (value: number) => value.toLocaleString('en-US') } },
    series: [
      {
        name: 'درآمد',
        type: 'bar',
        data: [12_000_000, 13_500_000, 11_000_000, 15_000_000, 12_500_000, 14_200_000],
        itemStyle: { color: '#16a34a', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 28,
      },
      {
        name: 'هزینه',
        type: 'bar',
        data: [8_000_000, 9_200_000, 7_800_000, 10_100_000, 8_200_000, 9_400_000],
        itemStyle: { color: '#dc2626', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 28,
      },
    ],
  };

  protected readonly categoryChartOption: EChartsOption = {
    tooltip: { trigger: 'item', valueFormatter: (value) => `${Number(value).toLocaleString('en-US')} تومان` },
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
        data: [
          { name: 'خوراک', value: 3_200_000, itemStyle: { color: '#16a34a' } },
          { name: 'حمل و نقل', value: 1_500_000, itemStyle: { color: '#2563eb' } },
          { name: 'اجاره', value: 2_500_000, itemStyle: { color: '#dc2626' } },
          { name: 'تفریح', value: 700_000, itemStyle: { color: '#f59e0b' } },
          { name: 'سایر', value: 300_000, itemStyle: { color: '#6b7280' } },
        ],
      },
    ],
  };
}
