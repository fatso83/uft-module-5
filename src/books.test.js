import BooksPresenter from "./Books/BooksPresenter";
import booksRepository from "./Books/BooksRepository";

const getBooksStubData = {
  success: true,
  result: [
    {
      bookId: 81351,
      name: "Naiv Super",
      ownerId: "carlerik@gmail.com",
      author: "Erlend Loe"
    },
    {
      bookId: 81391,
      name: "Ulysses",
      ownerId: "carlerik@gmail.com",
      author: "James Joyce"
    },
    {
      bookId: 81401,
      name: "Flegmatic",
      ownerId: "carlerik@gmail.com",
      author: "Fiodor Flegma"
    }
  ]
};
const getAllBooksStubData = {
  success: true,
  result: [
    { bookId: 31, name: "Moby Dick", ownerId: null, author: "Herman Melville" },
    { bookId: 41, name: "The Art of War", ownerId: null, author: "Sun Tzu" },
    {
      bookId: 81351,
      name: "Naiv Super",
      ownerId: "carlerik@gmail.com",
      author: "Erlend Loe"
    },
    {
      bookId: 81391,
      name: "Ulysses",
      ownerId: "carlerik@gmail.com",
      author: "James Joyce"
    },
    {
      bookId: 81401,
      name: "Flegmatic",
      ownerId: "carlerik@gmail.com",
      author: "Fiodor Flegma"
    }
  ]
};

let presenter;
let viewModel;

async function setup(mode) {
  viewModel = null;
  presenter = null;
  booksRepository.gateway.get = jest.fn((path) =>
    path === "/allbooks" ? getAllBooksStubData : getBooksStubData
  );
  presenter = new BooksPresenter();
  presenter.setMode(mode);
  await presenter.load((generatedViewModel) => {
    viewModel = generatedViewModel;
  });
}

describe("bookloading", () => {
  it("should load private books", async () => {
    await setup("private");
    // ensure it calls the /books endpoint
    expect(booksRepository.gateway.get).toHaveBeenCalledWith("/books");
    // compare to expected state
    expect(viewModel[0].name).toEqual("Naiv Super");
    expect(viewModel[1].name).toEqual("Ulysses");
    expect(viewModel[2].name).toEqual("Flegmatic");
  });

  it("should load private books by default", async () => {
    await setup(undefined);
    // ensure it calls the /books endpoint
    expect(booksRepository.gateway.get).toHaveBeenCalledWith("/books");
    // compare to expected state
    expect(viewModel[0].name).toEqual("Naiv Super");
    expect(viewModel[1].name).toEqual("Ulysses");
    expect(viewModel[2].name).toEqual("Flegmatic");
  });

  it("should load public books", async () => {
    await setup("public");
    expect(booksRepository.gateway.get).toHaveBeenCalledWith("/allbooks");

    expect(viewModel[0].name).toEqual("Moby Dick");
    expect(viewModel[1].name).toEqual("The Art of War");
    expect(viewModel[2].name).toEqual("Naiv Super");
    expect(viewModel[3].name).toEqual("Ulysses");
    expect(viewModel[4].name).toEqual("Flegmatic");
  });
});

describe("sorting", () => {
  it("should sort sort ascending when asked", async () => {
    await setup("public");

    expect(viewModel.length).toEqual(5);
    expect(viewModel[0].name).toEqual("Moby Dick");
    expect(viewModel[1].name).toEqual("The Art of War");

    await presenter.setSort("ASC");

    expect(viewModel.length).toEqual(5);
    expect(viewModel[0].name).toEqual("Flegmatic");
    expect(viewModel[1].name).toEqual("Moby Dick");
    expect(viewModel[4].name).toEqual("Ulysses");
  });

  it("should sort sort descending when asked", async () => {
    await setup("public");

    await presenter.setSort("DESC");

    expect(viewModel.length).toEqual(5);
    expect(viewModel[4].name).toEqual("Flegmatic");
    expect(viewModel[3].name).toEqual("Moby Dick");
    expect(viewModel[0].name).toEqual("Ulysses");
  });
});
