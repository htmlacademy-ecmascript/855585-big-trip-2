import {render, replace} from '../framework/render.js';
import PointView from '../view/point-view.js';
import {isEscapeKey} from '../utils/common.js';
import EditFormView from '../view/edit-form-view.js';

export default class PointPresenter {
  #pointListContainer = null;

  #pointViewComponent = null;
  #editFormViewComponent = null;

  #point = null;

  #offers = [];
  #destinations = [];

  //Присвоим контейнер для точек в конструктор офферы и направления и их будем передавать через род-й перезентер
  constructor({pointListContainer, offers, destinations}) {
    this.#pointListContainer = pointListContainer;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  //Заведем метод инициализации презенетра
  init(point) {
    this.#point = point;

    //Создадим экземпляры наших вью
    this.#pointViewComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#escKeydownHandler);
      }
    });

    this.#editFormViewComponent = new EditFormView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onSubmit: () => {
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', this.#escKeydownHandler);
      }
    });

    //Отрендерим вью
    render(this.#pointViewComponent, this.#pointListContainer);
  }

  //Бывшие функции метода renderPoint стали полноценными функциями
  #replacePointToForm() {
    replace(this.#editFormViewComponent, this.#pointViewComponent);
  }

  #replaceFormToPoint() {
    replace(this.#pointViewComponent, this.#editFormViewComponent);
  }

  #escKeydownHandler = (evt) => {
    if (isEscapeKey) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeydownHandler);
    }
  };
}
