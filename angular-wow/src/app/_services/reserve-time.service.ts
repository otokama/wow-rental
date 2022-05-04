import { Injectable } from '@angular/core';
import {Time} from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ReserveTimeService {
    timeOptions: Time[];

    constructor() {
        this.timeOptions = [{hours: 8, minutes: 30}, {hours: 9, minutes: 0}, {hours: 9, minutes: 30}, {hours: 10, minutes: 0},
            {hours: 10, minutes: 30}, {hours: 11, minutes: 0}, {hours: 11, minutes: 30}, {hours: 12, minutes: 0},
            {hours: 12, minutes: 30}, {hours: 13, minutes: 0}, {hours: 13, minutes: 30}, {hours: 14, minutes: 0},
            {hours: 14, minutes: 30}, {hours: 15, minutes: 0}, {hours: 15, minutes: 30}, {hours: 16, minutes: 0},
            {hours: 16, minutes: 30}, {hours: 17, minutes: 0}, {hours: 17, minutes: 30}, {hours: 18, minutes: 0},
            {hours: 18, minutes: 30}, {hours: 19, minutes: 0}, {hours: 19, minutes: 30}, {hours: 20, minutes: 0},
            {hours: 20, minutes: 30}];
    }

    getTimeOptions(): Time[] {
        return this.timeOptions;
    }

    compareTime(t1: Time, t2: Time): number {
        if (t1.hours < t2.hours) {
            return -1;
        } else if (t1.hours === t2.hours) {
            if (t1.minutes <= t2.minutes) {
                return -1;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    }

    compareDate(d1: Date, d2: Date): boolean {
        return (d1.getMonth() === d2.getMonth()
            && d1.getDate() === d2.getDate());
    }

    getDuration(d1: Date, d2: Date): number {
        if (this.compareDate(d1, d2)){
            return 1;
        }
        return Math.ceil(Math.abs(d1.getTime() - d2.getTime())) / (1000 * 60 * 60 * 24);
    }

    isBetween(d1: Date, d2: Date, checkValid: Date): boolean{
        return d1 < checkValid && d2 > checkValid;
    }

    private displayHour(num: number): string {
        if (num < 10) {
            return '0' + num.toString();
        } else {
            return num.toString();
        }
    }

    private displayMin(num: number): string {
        if (num !== 30) {
            return '00';
        } else {
            return num.toString();
        }
    }

    displayTime(t: Time): string {
        return this.displayHour(t.hours) + ' : ' + this.displayMin(t.minutes);
    }

}
