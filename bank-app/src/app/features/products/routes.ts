import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list.component')
      .then(m => m.ProductListComponent)
  },
  {
    path: 'products/create',
    loadComponent: () => import('./components/product-form/product-form.component')
      .then(m => m.ProductFormComponent)
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./components/product-form/product-form.component')
      .then(m => m.ProductFormComponent)
  },
];