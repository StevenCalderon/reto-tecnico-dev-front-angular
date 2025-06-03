import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiService } from "../../../../core/services/api.service";
import { IProduct, IProductCreateResponse } from "../../models/product.model";

@Injectable({ providedIn: 'root' })
export class ProductFormService {
    private readonly apiService = inject(ApiService);
  
    getProductById(id: string): Observable<IProduct | undefined> {
      return this.apiService.getProducts().pipe(
        map(response => response.data.find(p => p.id === id))
      );
    }
  
    verifyProductId(id: string): Observable<boolean> {
      return this.apiService.verifyProductId(id);
    }
  
    saveProduct(product: IProduct, isEditMode: boolean, productId?: string): Observable<IProductCreateResponse> {
      if (isEditMode && productId) {
        return this.apiService.updateProduct(productId, product);
      }
      return this.apiService.createProduct(product);
    }
}
