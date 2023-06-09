import express from "express";
import axios from "axios";
import { GoogleBooksResponse } from "../models/googleBooksModel";

const queryParameters = [
  "intitle",
  "inauthor",
  "inpublisher",
  "subject",
  "isbn",
  "lccn",
  "oclc",
  "q",
];

export const getBooks = async (req: express.Request, res: express.Response) => {
  const query = queryParameters
    .filter((param) => req.query[param])
    .map((param) => `${param}:${req.query[param]}+`)
    .join("");

  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

  try {
    const response = await axios.get<GoogleBooksResponse>(url);
    const data = response.data;
    const books = data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publisher: item.volumeInfo.publisher,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      isbn: item.volumeInfo.industryIdentifiers.find(
        (ii) => ii.type === "ISBN_13"
      )?.identifier,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories,
      maturityRating: item.volumeInfo.maturityRating,
      averageRating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount,
      language: item.volumeInfo.language,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      previewLink: item.volumeInfo.previewLink,
      infoLink: item.volumeInfo.infoLink,
      canonicalVolumeLink: item.volumeInfo.canonicalVolumeLink,
      saleInfo: item.saleInfo,
    }));
    res.json(books);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Une erreur inconnue s'est produite");
    }
  }
};
