import HttpGateway from "../Shared/HttpGateway";
import Observable from "../Shared/Observable";

class BooksRepository {
  programmersModel = null;
  callback = null;
  usePublicBooks = false;

  constructor() {
    this.gateway = new HttpGateway();
    this.programmersModel = new Observable([]);
  }

  get subResource() {
    return this.usePublicBooks ? "allbooks" : "books";
  }

  getBooks = async (callback) => {
    this.programmersModel.subscribe(callback);
    await this.loadApiData();
  };

  loadApiData = async () => {
    const dto = await this.gateway.get("/" + this.subResource);
    this.programmersModel.value = dto.result.map((dtoItem) => {
      return dtoItem;
    });
  };

  refreshModelData = () => {
    this.programmersModel.value = this.programmersModel.value.map((pm) => {
      return pm;
    });
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
