import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
export default class DestinationsModel extends Observable {

  #destinations = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;

  }

  async init() {
    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }


  //Получим данные из свойства destinations
  get destinations() {
    return this.#destinations;
  }
}
