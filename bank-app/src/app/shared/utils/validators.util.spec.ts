import { FormControl } from '@angular/forms';
import { formatDateToYYYYMMDD } from './date.util';
import { dateNotBeforeTodayValidator, urlValidator } from './validators.util';

describe('urlValidator', () => {
  it('should accept a valid URL with https', () => {
    const control = new FormControl('https://google.com');
    expect(urlValidator()(control)).toBeNull();
  });

  it('should accept a valid URL with http', () => {
    const control = new FormControl('http://test.com');
    expect(urlValidator()(control)).toBeNull();
  });

  it('should accept a valid URL with subdomain and path', () => {
    const control = new FormControl('https://sub.domain.com/path');
    expect(urlValidator()(control)).toBeNull();
  });

  it('should reject a plain text that is not a URL', () => {
    const control = new FormControl('not-a-url');
    expect(urlValidator()(control)).toEqual({ invalidUrl: true });
  });

  it('should reject a URL without protocol', () => {
    const control = new FormControl('www.google.com');
    expect(urlValidator()(control)).toEqual({ invalidUrl: true });
  });

  it('should accept an empty field (let the required validator handle it)', () => {
    const control = new FormControl('');
    expect(urlValidator()(control)).toBeNull();
  });

  it('should reject a non-string value', () => {
    const control = new FormControl(12345);
    expect(urlValidator()(control)).toEqual({ invalidUrl: true });
  });
});

describe('dateNotBeforeTodayValidator', () => {
  const validator = dateNotBeforeTodayValidator();

  it('should accept an empty field (let the required validator handle it)', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('should accept today as a valid date', () => {
    const todayStr = formatDateToYYYYMMDD(new Date());
    const control = new FormControl(todayStr);
    expect(validator(control)).toBeNull();
  });

  it('should accept a future date as valid', () => {
    const future = new Date();
    future.setDate(future.getDate() + 1);
    const futureStr = formatDateToYYYYMMDD(future);
    const control = new FormControl(futureStr);
    expect(validator(control)).toBeNull();
  });

  it('should reject a past date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const pastStr = formatDateToYYYYMMDD(past);
    const control = new FormControl(pastStr);
    expect(validator(control)).toEqual({ dateBeforeToday: true });
  });

  it('should reject a non-date value', () => {
    const control = new FormControl('no-es-fecha');
    expect(validator(control)).toEqual({ dateBeforeToday: true });
  });
}); 