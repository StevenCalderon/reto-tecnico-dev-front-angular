export interface IProduct {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: string;
    date_revision: string;
  }
  
  export interface IProductForm {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: Date;
    date_revision: Date;
  }
  export interface IProductListResponse {
        data: IProduct[];
  }

  export interface IProductCreateResponse {
    message: string;
    data: IProduct;
  }