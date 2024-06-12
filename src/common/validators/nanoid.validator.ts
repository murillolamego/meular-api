import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { customIdAlphabet } from '../../utils/custom-id/custom-id';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsNanoIdConstraint implements ValidatorConstraintInterface {
  validate(id: string, args: ValidationArguments) {
    if (id.length !== 12) {
      return false;
    }
    return id.split('').every((ch) => {
      return customIdAlphabet.indexOf(ch) !== -1;
    });
  }
}

export function IsNanoId(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNanoIdConstraint,
    });
  };
}
