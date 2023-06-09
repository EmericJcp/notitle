export interface IndustryIdentifier {
  type: string;
  identifier: string;
}

export interface VolumeInfo {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  industryIdentifiers: IndustryIdentifier[];
  pageCount: number;
  categories: string[];
  maturityRating: string;
  averageRating: number;
  ratingsCount: number;
  language: string;
  imageLinks: {
    thumbnail: string;
  };
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

export interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice: {
    amount: number;
    currencyCode: string;
  };
  retailPrice: {
    amount: number;
    currencyCode: string;
  };
  buyLink: string;
}

export interface Book {
  id: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
}

export interface GoogleBooksResponse {
  items: Book[];
}
