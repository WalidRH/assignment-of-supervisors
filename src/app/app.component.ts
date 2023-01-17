import { Time } from '@angular/common';
import { Component } from '@angular/core';
import { Subject } from './model/subject';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  listSubject = new Array<Subject>;
  fileData = {};

  getFileData(event: any) {
    this.fileData = event;
    console.log('WAL ::: ', this.fileData);
  }
  onLoadSupervisors() {
    this.fileData['sheet1'].forEach((element, index) => {
      this.listSubject.push({
        id: index,
        name: element.matière,
        Date: new Date(element.Date),
        start_hour: this.toTime(index, element.Heure),
        Duration: this.toTime(index, element.Durée),
        location: this.loadLoactions(element.local),
        total_supervisors: element.nombre_surveillant,
        list_supervisors: [],
      });
    });
  }

  toTime(index: number, time: string): Time {
    const reg = /^\d\d:\d\d+$/g;
    console.log('WAL :::', !!reg.test(time));
    if (!!reg.test(time)) throw new Error('Something went wrong');
    let _time = time.split(':', 2);
    return { hours: +_time[0], minutes: +_time[1] };
  }

  loadLoactions(location: string): Array<{ name: string; number: number }> {
    let _listLocation = new Array<{ name: string; number: number }>;
    let _locations = location.split(',', location.length);
    const regExp = /\(([^)]+)\)/g;
    _locations.forEach((element) => {
      _listLocation.push({
        name: element.split('(', element.length)[0],
        number: +element.match(regExp),
      });
    });
    return _listLocation;
  }
}
