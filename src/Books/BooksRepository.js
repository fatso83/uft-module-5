import HttpGateway from "../Shared/HttpGateway";
import Observable from "../Shared/Observable";

class BooksRepository {
  programmersModel = null;
  #usePublic = false;
  #order = null;

  constructor() {
    this.gateway = new HttpGateway();
    this.programmersModel = new Observable([]);
  }

  #applyTransformationsAndUpdatePM = (listOfPmBooks) => {
    this.programmersModel.value = this.#applySorting(listOfPmBooks);
  };

  #applySorting = (list) => {
    if (["ASC", "DESC"].includes(this.#order)) {
      const direction = this.#order === "ASC" || -1;
      return list.slice().sort((a, b) => {
        return direction * a.name.localeCompare(b.name);
      });
    }
    return list;
  };

  #subResource = () => {
    return this.#usePublic ? "allbooks" : "books";
  };

  getBooks = async (callback) => {
    this.programmersModel.subscribe(callback);
    await this.loadApiData();
  };

  loadApiData = async () => {
    const dto = await this.gateway.get("/" + this.#subResource());
    const pmBooks = dto.result.map((dtoItem) => dtoItem);
    this.#applyTransformationsAndUpdatePM(pmBooks);
  };

  async usePublicBooks(flag) {
    this.#usePublic = flag;
    this.loadApiData();
  }

  async setSortOrder(order) {
    this.#order = order;
    this.#applyTransformationsAndUpdatePM(this.programmersModel.value);
  }
}

const booksRepository = new BooksRepository();
export default booksRepository;
