import { inject, Injectable } from "@angular/core";
import { map, Observable, switchMap, throwError } from "rxjs";
import { ApiService } from "../../../../core/services/api.service";
import { ID_NOT_VALID } from "../../../../shared/constants/error.constants";
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
      return this.verifyProductId(product.id).pipe(
        switchMap(isRepeated => {
          if (isRepeated) {
            return throwError(() => new Error(ID_NOT_VALID));
          }
          return this.apiService.createProduct(product);
        })
      );
    }
}
