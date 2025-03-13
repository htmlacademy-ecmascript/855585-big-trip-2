import {render, remove} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointView from '../view/no-point-view.js';
import {generateFilter} from '../mock/filter.js';
import PointPresenter from './point-presenter.js';
import {SortType, UpdateType, UserAction} from '../const.js';
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

  #pointPresenters = new Map();
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
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  //Будет реагировать на изменения модели
  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderPointsList();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard({resetSortType: true});
        this.#renderPointsList();
        break;
    }
  };


  #handleSortTypeChange = (sortType) => {
    //Сортируем задачи
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard({resetRenderedTaskCount: true});
    this.#renderSort(); // Добавляем повторный рендер сортировки
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortingComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortingComponent, this.#container);
  }

  #renderFilter() {
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #renderPointsList() {
    render(this.#pointsListComponent, this.#container);

    const points = this.points; // Берем уже отсортированные точки

    if(points.length === 0) {
      this.#renderEmptyPointsList();
    }

    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i]);
    }
  }

  #clearBoard({resetSortType = false} = {}) {

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#noPointComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
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
