import { Time } from '@angular/common';

export interface Subject {
  id: number
  name: string;
  Date: Date;
  start_hour: Time;
  Duration: Time;
  location: Array<{ name: string; number: number }>;
  total_supervisors: number;
  list_supervisors: Array<String>;
}
