import {remove, render, replace} from '../framework/render.js';
import PointView from '../view/point-view.js';
import {isEscapeKey} from '../utils/common.js';
import EditFormView from '../view/edit-form-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;

  #pointComponent = null;
  #editFormComponent = null;

  #point = null;

  #offers = [];
  #destinations = [];

  //Присвоим контейнер для точек в конструктор офферы и направления и их будем передавать через род-й перезентер
  constructor({pointListContainer, offers, destinations, onDataChange}) {
    this.#pointListContainer = pointListContainer;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
  }

  //Заведем метод инициализации презенетра
  init(point) {
    this.#point = point;

    //Создадим переменные для экземпляров вью (там будет либо null либо соотв-й экземпляр))
    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    //Создадим экземпляры наших вью
    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#escKeydownHandler);
      },
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editFormComponent = new EditFormView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onSubmit: () => {
        this.#handleSubmit(this.#point);
        document.removeEventListener('keydown', this.#escKeydownHandler);
      },
    });

    //Проверяем не равны ли экзмепляры null
    if(prevPointComponent === null || prevEditFormComponent === null) {
      //Отрендерим вью
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    //Проверям нет ли в dom дереве отрисованного компонента точки (обращаемся prevPointComponent.element с сотоянием)
    if(this.#pointListContainer.contains(prevPointComponent.element)) {
      //Заменяем старый компонент на новый
      replace(this.#pointComponent, prevPointComponent);
    }

    //Проверям нет ли в dom дереве отрисованного компонента формы редктирования
    if(this.#pointListContainer.contains(prevEditFormComponent.element)) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    //Удаляем старые компоненты
    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  //Метод для удаления компонентов точки и формы
  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  //Бывшие функции метода renderPoint стали полноценными функциями
  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
  };

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
  }

  #escKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeydownHandler);
    }
  };
}
