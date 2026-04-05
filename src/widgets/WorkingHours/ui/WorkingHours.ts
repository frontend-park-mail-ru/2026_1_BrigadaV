import './style.scss';
import { stringToElement } from '@/shared/utils';
import template from './WorkingHours.hbs?compiled';

export class WorkingHours {
  public render(): HTMLElement {
    // статичные данные
    const hours = {
      monday: '10:00 – 18:00',
      tuesday: '10:00 – 18:00',
      wednesday: '10:00 – 18:00',
      thursday: '10:00 – 18:00',
      friday: '10:00 – 18:00',
      saturday: '10:00 – 19:00',
      sunday: '10:00 – 19:00',
    };
    return stringToElement(template(hours));
  }
}