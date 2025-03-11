import {render} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointView from '../view/no-point-view.js';
import {generateFilter} from '../mock/filter.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../const.js';
import {sortPointByDate, sortPointByPrice, sortPointByTime} from '../utils/point.js';

//Создадим класс, включающий в себя отрисовку остальных связанных компонентов
export default class MainPresenter {
  #container = null;
  #filtersContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #offers = [];
  #destinations = [];

  #filtersComponent = null;
  #sortingComponent = null;
  #pointsListComponent = new PointsListView();
  #noPointComponent = new NoPointView({messageType: 'EVERYTHING'});

  #pointPresenters = new Map();//при замене на Set ошибка, что нет метода set
  #currentSortType = SortType.DAY;


  constructor({container, filtersContainer, pointsModel, offersModel, destinationsModel}) {
  //Данные из main.js сохранили внутри класса
    this.#container = container;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);

    const filters = generateFilter((this.#pointsModel.points));
    this.#filtersComponent = new FiltersView({filters});
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY.text:
        return [...this.#pointsModel.points].sort(sortPointByDate);
      case SortType.TIME.text:
        return [...this.#pointsModel.points].sort(sortPointByTime);
      case SortType.PRICE.text:
        return [...this.#pointsModel.points].sort(sortPointByPrice);
    }

    return this.#pointsModel.points;
  }


  init() {
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];


    this.#renderComponents();
  }

  #renderComponents() {
    this.#renderFilter();
    this.#renderSort();
    this.#renderPointsList();
  }

  #handlePointChange = (updatedPoint) => {
    //Здесь будем вызывать обновление модели

    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  //Будет реагировать на изменения модели
  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };


  #handleSortTypeChange = (sortType) => {
    //Сортируем задачи
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortingComponent, this.#container);
  }

  #renderFilter() {
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPointsList() {
    render(this.#pointsListComponent, this.#container);

    if(this.#pointsModel.points.length === 0) {
      this.#renderEmptyPointsList();
    }

    for (let i = 0; i < this.#pointsModel.points.length; i++) {
      this.#renderPoint(this.#pointsModel.points[i]);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      offers: this.#offers,
      destinations: this.#destinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    //Сохраняем созданный экземпляр (this.#pointPresenters - экземпляр коллекции Map)
    // set передаем ключ (id) и сами данные экземпляр pointPresenter
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderEmptyPointsList() {
    render(this.#noPointComponent, this.#pointsListComponent.element);
  }
}
