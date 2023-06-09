import React, { useState } from "react";
import { GoogleBooksResponse } from "../../Hooks/useAxiosPost";
import "./BookDetails.css";

interface Props {
  book: GoogleBooksResponse["items"][0];
}

function BookDetails({ book }: Props) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const description = book.volumeInfo.description;
  const shortDescription = description.split(" ").slice(0, 500).join(" ") + ".";

  return (
    <div className="book-details">
      <div className="book-header">
        <div className="book-image">
          <img
            src={book.volumeInfo.imageLinks.thumbnail || "-"}
            alt={book.volumeInfo.title || "-"}
          />
        </div>
        <div className="book-info-container">
          <div className="book-title-author">
            <h3 className="book-authors">
              {book.volumeInfo.authors?.join(", ") || "-"}
            </h3>
            <h2 className="book-title">{book.volumeInfo.title || "-"}</h2>
          </div>
          <div className="book-description-container">
            <p className="book-description">
              {showFullDescription ? description : shortDescription}
              {!showFullDescription && (
                <span
                  className="more"
                  onClick={() => setShowFullDescription(true)}
                >
                  .
                </span>
              )}
            </p>
          </div>
          <div className="book-additional-info">
            <div className="book-info">
              <div className="book-published-date sep">
                <h4>Date</h4>
                <p>{book.volumeInfo.publishedDate?.split("-")[0] || "-"}</p>
              </div>
              <div className="separator"></div>
              <div className="book-categories sep">
                <h4>Catégorie</h4>
                <p>{book.volumeInfo.categories?.join(", ") || "-"}</p>
              </div>
              <div className="separator"></div>
              <div className="book-publisher sep">
                <h4>Editeur</h4>
                <p>{book.volumeInfo.publisher || "-"}</p>
              </div>
              <div className="separator"></div>
              <div className="book-page-count sep">
                <h4>Pages</h4>
                <p>{book.volumeInfo.pageCount || "-"}</p>
              </div>
              <div className="separator"></div>
              <div className="book-isbn sep">
                <h4>ISBN</h4>
                <p>
                  {book.volumeInfo.industryIdentifiers?.find(
                    (ii) => ii.type === "ISBN_13"
                  )?.identifier || "???"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="book-buy">
          {/* <div className="book-purchase-info">
            <p className="book-price">
              List Price: {book.saleInfo?.listPrice?.amount || "-"}{" "}
              {book.saleInfo?.listPrice?.currencyCode || "-"}
            </p>
            <a className="book-buy-link" href={book.saleInfo?.buyLink || "#"}>
              <img src="/assets/images/icons/cart.svg" alt="search" />
            </a>
          </div> */}
          <div
            className={`book-purchase-info ${
              book.saleInfo?.buyLink ? "" : "disabled"
            }`}
          >
            <a
              className="book-buy-link"
              href={book.saleInfo?.buyLink || "#"}
              onClick={(e) => {
                if (!book.saleInfo?.buyLink) e.preventDefault();
              }}
            >
              <img src="/assets/images/icons/cart.svg" alt="search" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
