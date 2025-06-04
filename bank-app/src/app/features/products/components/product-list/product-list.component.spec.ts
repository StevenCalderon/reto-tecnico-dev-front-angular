import { IProduct } from '../../models/product.model';
import { filterProducts, getProductName, paginateProducts } from './production-list.utils';

const mockProducts: IProduct[] = [
  {
    id: 'p1',
    name: 'Product One',
    description: 'First product',
    logo: 'https://logo.com/1.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  },
  {
    id: 'p2',
    name: 'Product Two',
    description: 'Second product',
    logo: 'https://logo.com/2.png',
    date_release: '2025-02-01',
    date_revision: '2026-02-01'
  },
  {
    id: 'p3',
    name: 'Another',
    description: 'Another product',
    logo: 'https://logo.com/3.png',
    date_release: '2025-03-01',
    date_revision: '2026-03-01'
  }
];


describe('ProductList logic', () => {
  it('should filter products by search term (case insensitive)', () => {
    const filtered = filterProducts(mockProducts, 'First');
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('p1');
  });

  it('should return all products if search is empty', () => {
    const filtered = filterProducts(mockProducts, '');
    expect(filtered.length).toBe(3);
  });

  it('should return empty array if no product matches search', () => {
    const filtered = filterProducts(mockProducts, 'notfound');
    expect(filtered.length).toBe(0);
  });

  it('should paginate products correctly', () => {
    const page1 = paginateProducts(mockProducts, 1, 2);
    expect(page1.length).toBe(2);
    expect(page1[0].id).toBe('p1');
    expect(page1[1].id).toBe('p2');
    const page2 = paginateProducts(mockProducts, 2, 2);
    expect(page2.length).toBe(1);
    expect(page2[0].id).toBe('p3');
  });

  it('should return empty array if page is out of range', () => {
    // Caso de borde: página fuera de rango
    const page3 = paginateProducts(mockProducts, 3, 2);
    expect(page3.length).toBe(0);
  });

  it('should get product name by ID', () => {
    expect(getProductName(mockProducts, 'p2')).toBe('Product Two');
    expect(getProductName(mockProducts, 'not-exist')).toBe('');
  });

  it('should handle empty product list gracefully', () => {
    expect(filterProducts([], 'product').length).toBe(0);
    expect(paginateProducts([], 1, 2).length).toBe(0);
    expect(getProductName([], 'p1')).toBe('');
  });

  it('should toggle menu for a product (simulate logic)', () => {
    let activeMenu: string | null = null;
    function toggleMenu(productId: string) {
      activeMenu = activeMenu === productId ? null : productId;
    }
    toggleMenu('p1');
    expect(activeMenu).toBe('p1');
    toggleMenu('p1');
    expect(activeMenu).toBe(null);
    toggleMenu('p2');
    expect(activeMenu).toBe('p2');
  });

  it('should paginate correctly when itemsPerPage changes', () => {
    let page1 = paginateProducts(mockProducts, 1, 1);
    expect(page1.length).toBe(1);
    expect(page1[0].id).toBe('p1');
    let page2 = paginateProducts(mockProducts, 2, 1);
    expect(page2.length).toBe(1);
    expect(page2[0].id).toBe('p2');
    let page3 = paginateProducts(mockProducts, 3, 1);
    expect(page3.length).toBe(1);
    expect(page3[0].id).toBe('p3');
    
    let page1_2 = paginateProducts(mockProducts, 1, 2);
    expect(page1_2.length).toBe(2);
    expect(page1_2[0].id).toBe('p1');
    expect(page1_2[1].id).toBe('p2');
    let page2_2 = paginateProducts(mockProducts, 2, 2);
    expect(page2_2.length).toBe(1);
    expect(page2_2[0].id).toBe('p3');
  });
});
