import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct, IProductCreateResponse, IProductListResponse } from '../../features/products/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:3002/bp';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProductListResponse> {
    return this.http.get<IProductListResponse>(`${this.API_URL}/products`);
  }

  createProduct(product: IProduct): Observable<IProductCreateResponse> {
    return this.http.post<IProductCreateResponse>(`${this.API_URL}/products`, product);
  }

  updateProduct(id: string, product: Partial<IProduct>): Observable<IProductCreateResponse> {
    return this.http.put<IProductCreateResponse>(`${this.API_URL}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/products/${id}`);
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/products/verification/${id}`);
  }
}