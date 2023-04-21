import booksRepository from "./BooksRepository.js";

export default class BooksPresenter {
  #order = null;

  load = async (callback) => {
    await booksRepository.getBooks((booksPm) => {
      const booksVm = booksPm.map((bookPm) => {
        return { name: bookPm.name, author: bookPm.author };
      });

      if (["ASC", "DESC"].includes(this.#order)) {
        const direction = this.#order === "ASC" || -1;
        booksVm.sort((a, b) => {
          return direction * a.name.localeCompare(b.name);
        });
      }

      callback(booksVm);
    });
  };

  setMode = async (mode) => {
    booksRepository.usePublicBooks = mode === "public";
    booksRepository.loadApiData();
  };

  setSort = async (order) => {
    this.#order = order;
    booksRepository.refreshModelData();
  };
}
