import React, { useEffect, useState } from "react";
import useAxiosPost from "../../Hooks/useAxiosPost";
import "./HomeMain.css";
import SearchForm from "../SearchForm/SearchForm";
import BookDetails from "../BookDetails/BookDetails";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";

function HomeMain() {
  const [description, setDescription] = useState<string>("");
  const { data, error, isLoading, postData, resetData } = useAxiosPost(
    "http://localhost:3000/gptBooks/summary"
  );

  const [toggle, setToggle] = useState(false);
  const [mainHeight, setMainHeight] = useState("70vh");
  const [bookInfosHeight, setBookInfosHeight] = useState("30vh");
  const [containerDimensions, setContainerDimensions] = useState({
    width: "80%",
    height: "80%",
  });

  useEffect(() => {
    if (data && !isLoading) {
      setToggle(true);
      setMainHeight("30vh");
      setBookInfosHeight("70vh");
      setContainerDimensions({ width: "90%", height: "90%" });
    }
  }, [data, isLoading]);

  const handleToggleClick = () => {
    setToggle(!toggle);
    if (toggle) {
      setMainHeight("70vh");
      setBookInfosHeight("30vh");
      setContainerDimensions({ width: "80%", height: "80%" });
      resetData();
    } else {
      setMainHeight("50vh");
      setBookInfosHeight("50vh");
      setContainerDimensions({ width: "90%", height: "90%" });
    }
  };

  const handleDataSubmission = (inputValue: string) => {
    postData({ summary: inputValue });
    setDescription(inputValue);
  };

  return (
    <>
      <section className="main" style={{ height: mainHeight }}>
        <img src="/assets/images/logo/notitle.svg" alt="" />
        <h1>LISEZ PLUS, CHERCHEZ MOINS</h1>
      </section>
      <section className="bookInfos" style={{ height: bookInfosHeight }}>
        <div
          className="container"
          style={{ ...containerDimensions, top: "80vh", scale: 0.925 }}
        >
          <SearchForm
            onSearch={handleDataSubmission}
            animationDone={!!data && !isLoading}
          />

          {data && data.items.length > 0 && (
            <BookDetails book={data.items[0]} />
          )}

          <div className="nav-toggle" onClick={handleToggleClick}>
            <img src="/assets/images/icons/cross.svg" id="toggle" alt="" />
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeMain;
