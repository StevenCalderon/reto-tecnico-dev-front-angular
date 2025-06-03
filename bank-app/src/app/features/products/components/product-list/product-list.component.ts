import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { IProduct } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from '../../../../shared/components/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, RouterModule, DatePipe, CommonModule, ConfirmationModalComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  
  products = signal<IProduct[]>([]);
  filteredProducts = signal<IProduct[]>([]);
  searchTerm = signal('');
  itemsPerPage = signal(5);
  currentPage = signal(1);
  totalPages = signal(0);
  activeMenu = signal<string | null>(null);
  showDeleteModal = signal(false);
  productToDelete = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  filterProducts(): void {
    const term = this.searchTerm().toLowerCase();
    const filtered = this.products().filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
    this.filteredProducts.set(filtered);
    this.calculatePagination();
  }

  get paginatedProducts(): IProduct[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredProducts().slice(start, end);
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
    this.currentPage.set(1);
    this.filterProducts();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage.set(itemsPerPage);
    this.currentPage.set(1);
    this.calculatePagination();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  toggleMenu(event: Event, productId: string): void {
    event.stopPropagation();
    if (this.activeMenu() === productId) {
      this.activeMenu.set(null);
    } else {
      this.activeMenu.set(productId);
    }
  }

  onEdit(productId: string): void {
    this.router.navigate(['/products/edit', productId]);
    this.activeMenu.set(null);
  }

  onDelete(id: string): void {
    const productToDelete = this.products().find(p => p.id === id);
    if (productToDelete) {
      this.productToDelete.set(id);
      this.showDeleteModal.set(true);
      this.activeMenu.set(null);
    }
  }

  confirmDelete(): void {
    const id = this.productToDelete();
    if (id) {
      this.apiService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.closeDeleteModal();
          // TODO: Mostrar mensaje de error al usuario
        },
        complete: () => {
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  private loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.filterProducts();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // TODO: Mostrar mensaje de error al usuario
      }
    });
  }

  private calculatePagination(): void {
    const totalItems = this.filteredProducts().length;
    this.totalPages.set(Math.ceil(totalItems / this.itemsPerPage()));
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(1);
    }
  }

  getProductName(id: string): string {
    const product = this.products().find(p => p.id === id);
    return product?.name || '';
  }
}