// SearchForm.tsx
import React, { FC, ReactElement, FormEvent, useRef } from "react";
import "./SearchForm.css";

interface SearchFormProps {
  onSearch: (inputValue: string) => void;
  animationDone: boolean;
}

const SearchForm: FC<SearchFormProps> = ({
  onSearch,
  animationDone,
}): ReactElement => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputRef.current) {
      onSearch(inputRef.current.value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputRef.current) {
        onSearch(inputRef.current.value);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          height: animationDone ? "12%" : "100%",
          padding: animationDone ? "0px" : "20px",
          borderBottom: animationDone ? "1px solid #101010" : "none",
        }}
      >
        <textarea
          ref={inputRef}
          placeholder="Dîtes-nous ce que vous aimeriez lire..."
          onKeyDown={handleKeyDown}
          style={{
            width: animationDone ? "98%" : "100%",
            paddingTop: animationDone ? "15px" : "0",
            whiteSpace: animationDone ? "nowrap" : "normal",
          }}
        />
        <button
          type="submit"
          style={{
            display: animationDone ? "none" : "block",
          }}
        >
          <img src="/assets/images/icons/search.svg" alt="search" />
        </button>
      </form>
    </>
  );
};

export default SearchForm;
