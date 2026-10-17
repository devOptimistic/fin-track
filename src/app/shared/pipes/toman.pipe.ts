import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toman',
  standalone: true,
})
export class TomanPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '0 تومان';
    }

    return `${value.toLocaleString('en-US')} تومان`;
  }
}
