import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { IProduct } from '../../models/product.model';

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
      logo: ['', [Validators.required]],
      date_release: ['', [
        Validators.required,
        this.dateNotBeforeTodayValidator()
      ]],
      date_revision: ['', [Validators.required]]
    });

    // Actualizar automáticamente la fecha de revisión
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
        // TODO: Mostrar mensaje de error
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

    this.submitting = true;
    const productData = this.productForm.value;

    const request$ = this.isEditMode ?
      this.apiService.updateProduct(this.route.snapshot.params['id'], productData) :
      this.apiService.createProduct(productData);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error saving product:', error);
        this.submitting = false;
        // TODO: Mostrar mensaje de error
      },
      complete: () => {
        this.submitting = false;
      }
    });
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
    
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['dateBeforeToday']) return 'La fecha debe ser igual o posterior a hoy';
    
    return 'Campo inválido';
  }
}
