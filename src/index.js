import React, { useState } from "react";

import BooksPresenter from "./Books/BooksPresenter.js";
import ReactDOM from "react-dom";

function App() {
  const booksPresenter = React.useMemo(() => new BooksPresenter(), []);
  const [stateViewModel, copyViewModelToStateViewModel] = useState([]);

  React.useEffect(() => {
    async function load() {
      await booksPresenter.load((viewModel) => {
        copyViewModelToStateViewModel(viewModel);
      });
    }
    load();
  }, [booksPresenter]);

  return (
    <>
      <h3>Books</h3>

      {/* for power up exercise */}
      <button onClick={() => booksPresenter.setMode("public")} type="button">
        Public
      </button>

      <button onClick={() => booksPresenter.setMode("private")} type="button">
        Private
      </button>
      <br />
      <button onClick={() => booksPresenter.setSort("ASC")} type="button">
        Sort on Name - ASC
      </button>
      <button onClick={() => booksPresenter.setSort("DESC")} type="button">
        Sort on Name - DESC
      </button>
      <br />

      <div>
        {stateViewModel.map((book, i) => {
          return <div key={i}>{book.name}</div>;
        })}
      </div>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
