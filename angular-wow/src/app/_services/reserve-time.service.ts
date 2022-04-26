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
