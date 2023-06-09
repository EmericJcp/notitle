import { useState } from "react";
import axios from "axios";

export interface VolumeInfo {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  imageLinks: {
    thumbnail: string;
  };
  industryIdentifiers?: { type: string; identifier: string }[];
  maturityRating?: string;
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
}

export interface SaleInfo {
  saleability?: string;
  buyLink?: string;
  listPrice?: { amount: number; currencyCode: string };
  retailPrice?: { amount: number; currencyCode: string };
}

export interface AccessInfo {
  epub: { isAvailable: boolean };
  pdf: { isAvailable: boolean };
}

export interface Book {
  id: string;
  volumeInfo: VolumeInfo;
  saleInfo?: SaleInfo;
  accessInfo?: AccessInfo;
}

export interface GoogleBooksResponse {
  items: Book[];
}

const useAxiosPost = (
  url: string
): {
  data: GoogleBooksResponse | null;
  error: string;
  isLoading: boolean;
  postData: (payload: any) => void;
  resetData: () => void;
} => {
  const [data, setData] = useState<GoogleBooksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const postData = (payload: any) => {
    axios
      .post<GoogleBooksResponse>(url, payload)
      .then((res) => setData(res.data))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  };

  const resetData = () => {
    setData(null);
    setIsLoading(true);
  };

  return { data, error, isLoading, postData, resetData };
};

export default useAxiosPost;
