import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../../features/products/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:3002/bp';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ data: IProduct[] }> {
    return this.http.get<{ data: IProduct[] }>(`${this.API_URL}/products`);
  }

  createProduct(product: IProduct): Observable<{ message: string; data: IProduct }> {
    return this.http.post<{ message: string; data: IProduct }>(`${this.API_URL}/products`, product);
  }

  updateProduct(id: string, product: Partial<IProduct>): Observable<{ message: string; data: IProduct }> {
    return this.http.put<{ message: string; data: IProduct }>(`${this.API_URL}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/products/${id}`);
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/products/verification/${id}`);
  }
}