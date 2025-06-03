import { Routes } from '@angular/router';
import { productRoutes } from './features/products/routes';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'products',
      pathMatch: 'full'
    },
    ...productRoutes
  ];