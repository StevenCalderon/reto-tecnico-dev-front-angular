import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ERROR_MESSAGES_BY_STATUS, ID_NOT_VALID } from '../../../../shared/constants/error.constants';
import { FIELD_LABELS } from '../../../../shared/constants/field-labels.const';
import { ErrorModalService } from '../../../../shared/services/error-modal.service';
import { formatDateToYYYYMMDD, parseLocalDate } from '../../../../shared/utils/date.util';
import { dateNotBeforeTodayValidator, urlValidator } from '../../../../shared/utils/validators.util';
import { ProductFormService } from './product-form.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  productFormService = inject(ProductFormService);
  errorModalService = inject(ErrorModalService);
  productForm!: FormGroup;
  isEditMode = false;
  submitting = false;
  productId = '';

  ngOnInit() {
    this.initForm();
    this.initializeEditModeIfNeeded();
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
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

  onSubmit() {
    if (this.productForm.invalid) {
      this.markAsTouchedForm();
      return;
    }
    this.saveProduct();
  }

  onReset() {
    this.productForm.reset();
    if (this.isEditMode) {
      this.loadProduct(this.productId);
    }
  }

  private initForm() {
    this.productForm = this.fb.group({
      id: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      logo: ['', [Validators.required, urlValidator()]],
      date_release: ['', [
        Validators.required,
        dateNotBeforeTodayValidator()
      ]],
      date_revision: ['', [Validators.required]]
    });
    this.setDateReleaseAuto();
  }

  private initializeEditModeIfNeeded() {
    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  private setDateReleaseAuto() {
    this.productForm.get('date_release')?.valueChanges.subscribe(date => {
      if (!date) return;
      const releaseDate = parseLocalDate(date);
      const revisionDate = new Date(releaseDate);
      revisionDate.setFullYear(releaseDate.getFullYear() + 1);
      this.productForm.patchValue({
        date_revision: formatDateToYYYYMMDD(revisionDate)
      }, { emitEvent: false });

    });
  }

  private loadProduct(id: string) {
    this.productFormService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.productForm.patchValue(product);
          this.productForm.get('id')?.disable();
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }

  private markAsTouchedForm() {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  private saveProduct() {
    this.submitting = true;
    const productData = this.productForm.value;
    this.productFormService.saveProduct(productData, this.isEditMode, this.productId).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.submitting = false;
        if (error.message === ID_NOT_VALID) {
          this.productForm.get('id')?.setErrors({ idNotValid: true });
          return;
        }
        const errorIsDefined: boolean = ERROR_MESSAGES_BY_STATUS[Number(error.status) as keyof typeof ERROR_MESSAGES_BY_STATUS] !== undefined;
        if (!errorIsDefined) {
          this.errorModalService.showError('Ocurrió un error inesperado.\n Error: ' + error.message);
        }
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }
}
