import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { IProduct, IProductCreateResponse } from '../../models/product.model';
import { Observable, tap } from 'rxjs';
import { urlValidator } from '../../../../shared/utils/validators.util';

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
  private apiService = inject(ApiService);

  productForm!: FormGroup;
  isEditMode = false;
  submitting = false;

  fieldLabels: { [key: string]: string } = {
    id: 'ID',
    name: 'Nombre',
    description: 'Descripción',
    logo: 'Logo',
    date_release: 'Fecha de liberación',
    date_revision: 'Fecha de reestructuración'
  };

  ngOnInit() {
    this.initForm();
    
    const productId = this.route.snapshot.params['id'];
    if (productId) {
      this.isEditMode = true;
      this.loadProduct(productId);
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
        this.dateNotBeforeTodayValidator()
      ]],
      date_revision: ['', [Validators.required]]
    });

    
    this.productForm.get('date_release')?.valueChanges.subscribe(date => {
      if (date) {
        const releaseDate = new Date(date);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(releaseDate.getFullYear() + 1);
        this.productForm.patchValue({
          date_revision: revisionDate.toISOString().split('T')[0]
        }, { emitEvent: false });
      }
    });
  }

  private dateNotBeforeTodayValidator() {
    return (control: any) => {
      if (!control.value) return null;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(control.value);
      inputDate.setHours(0, 0, 0, 0);

      return inputDate >= today ? null : { dateBeforeToday: true };
    };
  }

  private loadProduct(id: string) {
    this.apiService.getProducts().subscribe({
      next: (response) => {
        const product = response.data.find(p => p.id === id);
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

  onSubmit() {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const productData = this.productForm.value;
    if(this.isEditMode) {
      this.updateProduct(productData);
    } else {
      this.createProduct(productData);
    }

  }

  onReset() {
    this.productForm.reset();
    if (this.isEditMode) {
      const productId = this.route.snapshot.params['id'];
      this.loadProduct(productId);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    const label = this.fieldLabels[controlName] || controlName;

    if (errors['required']) return `${label} es requerido`;
    if (errors['minlength']) return `${label}: mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `${label}: máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['dateBeforeToday']) return `${label}: la fecha debe ser igual o posterior a hoy`;
    if (errors['idNotValid']) return 'El ID ya existe, por favor ingrese otro';
    if (errors['invalidUrl']) return `${label}: la URL no es válida`;

    return `${label} inválido`;
  }

  private handleProductRequest(request$: Observable<IProductCreateResponse>) {
    this.submitting = true;
    request$.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error en la operación:', error);
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }

  private createProduct(productData: IProduct) {
    this.apiService.verifyProductId(productData.id).subscribe((isRepeated) => {
      if(isRepeated) {
        this.productForm.get('id')?.setErrors({ idNotValid: true });
        return;
      } 
      this.handleProductRequest(this.apiService.createProduct(productData));
    });
  } 
  
  private updateProduct(productData: IProduct) {
    const id = this.route.snapshot.params['id'];
    this.handleProductRequest(this.apiService.updateProduct(id, productData));
  }
}
