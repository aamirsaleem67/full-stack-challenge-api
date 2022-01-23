import { registerDecorator, ValidationOptions } from 'class-validator';
import * as moment from 'moment';
import { DATE_FORMAT } from '../constants';

export function IsOnlyDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date with format YYYY-MM-D',
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          return moment(value, DATE_FORMAT, true).isValid();
        },
      },
    });
  };
}
