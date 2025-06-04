import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ID_NOT_VALID } from '../../../../shared/constants/error.constants';
import { FIELD_LABELS } from '../../../../shared/constants/field-labels.const';
import { formatDateToYYYYMMDD } from '../../../../shared/utils/date.util';
import { dateNotBeforeTodayValidator, urlValidator } from '../../../../shared/utils/validators.util';


// Simulate getErrorMessage function
const getErrorMessage = (form: FormGroup, controlName: string): string => {
    const control = form.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    const label = FIELD_LABELS[controlName] || controlName;

    if (errors['required']) return `${label} es requerido`;
    if (errors['minlength']) return `${label}: mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `${label}: máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['dateBeforeToday']) return `${label}: la fecha debe ser igual o posterior a hoy`;
    if (errors['idNotValid']) return ID_NOT_VALID;
    if (errors['invalidUrl']) return `${label}: la URL no es válida`;

    return `${label} inválido`;
  }

describe('ProductForm logic', () => {
  let fb: FormBuilder;
  let form: FormGroup;

  beforeEach(() => {
    fb = new FormBuilder();
    form = fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, urlValidator()]],
      date_release: ['', [Validators.required, dateNotBeforeTodayValidator()]],
      date_revision: ['', [Validators.required]]
    });
  });

  it('should create a form with all required controls', () => {
    expect(form.contains('id')).toBe(true);
    expect(form.contains('name')).toBe(true);
    expect(form.contains('description')).toBe(true);
    expect(form.contains('logo')).toBe(true);
    expect(form.contains('date_release')).toBe(true);
    expect(form.contains('date_revision')).toBe(true);
  });

  it('should require all fields', () => {
    form.setValue({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });
    expect(form.valid).toBe(false);
    expect(form.get('id')?.hasError('required')).toBe(true);
    expect(form.get('name')?.hasError('required')).toBe(true);
    expect(form.get('description')?.hasError('required')).toBe(true);
    expect(form.get('logo')?.hasError('required')).toBe(true);
    expect(form.get('date_release')?.hasError('required')).toBe(true);
    expect(form.get('date_revision')?.hasError('required')).toBe(true);
  });

  it('should validate minlength and maxlength for id', () => {
    form.get('id')?.setValue('a');
    expect(form.get('id')?.hasError('minlength')).toBe(true);
    form.get('id')?.setValue('a'.repeat(11));
    expect(form.get('id')?.hasError('maxlength')).toBe(true);
  });

  it('should validate custom dateNotBeforeTodayValidator', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = formatDateToYYYYMMDD(yesterday);
    form.get('date_release')?.setValue(yesterdayFormatted);
    expect(form.get('date_release')?.hasError('dateBeforeToday')).toBe(true);
    
    // Today should be valid
    const today = formatDateToYYYYMMDD(new Date());
    form.get('date_release')?.setValue(today);
    expect(form.get('date_release')?.valid).toBe(true);
  });

  it('should validate urlValidator for logo', () => {
    form.get('logo')?.setValue('not-a-url');
    expect(form.get('logo')?.hasError('invalidUrl')).toBe(true);
    form.get('logo')?.setValue('https://logo.com/img.png');
    expect(form.get('logo')?.valid).toBe(true);
  });


  it('should generate correct error messages', () => {
    form.get('id')?.setErrors({ required: true });
    form.get('id')?.markAsTouched();
    expect(getErrorMessage(form, 'id')).toContain('ID es requerido');
    form.get('name')?.setErrors({ minlength: { requiredLength: 5 } });
    form.get('name')?.markAsTouched();
    expect(getErrorMessage(form, 'name')).toContain('Nombre: mínimo 5 caracteres');
    form.get('description')?.setErrors({ maxlength: { requiredLength: 200 } });
    form.get('description')?.markAsTouched();
    expect(getErrorMessage(form, 'description')).toContain('Descripción: máximo 200 caracteres');
    form.get('date_release')?.setErrors({ dateBeforeToday: true });
    form.get('date_release')?.markAsTouched();
    expect(getErrorMessage(form, 'date_release')).toContain('Fecha de liberación: la fecha debe ser igual o posterior a hoy');
    form.get('logo')?.setErrors({ invalidUrl: true });
    form.get('logo')?.markAsTouched();
    expect(getErrorMessage(form, 'logo')).toContain('Logo: la URL no es válida');
    form.get('id')?.setErrors({ idNotValid: true });
    form.get('id')?.markAsTouched();
    expect(getErrorMessage(form, 'id')).toContain(ID_NOT_VALID);
  });
});
