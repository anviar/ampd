import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'secondsToMmSs' })
export class SecondsToMmSsPipe implements PipeTransform {
  public transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value - minutes * 60;
    const ret = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    return ret;
  }
}