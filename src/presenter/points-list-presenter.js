import {render} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointView from '../view/no-point-view.js';
import {generateFilter} from '../mock/filter.js';
import PointPresenter from './point-presenter.js';

//Создадим класс, включающий в себя отрисовку остальных связанных компонентов
export default class PointsListPresenter {
  #container = null;
  #filtersContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #points = [];
  #offers = [];
  #destinations = [];

  #filtersView = null;
  #sortingView = new SortingView();
  #pointsListViewComponent = new PointsListView();
  #noPointViewComponent = new NoPointView({messageType: 'EVERYTHING'});

  constructor({container, filtersContainer, pointsModel, offersModel, destinationsModel}) {
  //Данные из main.js сохранили внутри класса
    this.#container = container;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    const filters = generateFilter((this.#pointsModel.points));

    this.#filtersView = new FiltersView({filters});
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderComponents();
  }

  #renderComponents() {
    this.#renderFilter();
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderFilter() {
    render(this.#filtersView, this.#filtersContainer);
  }

  #renderSort() {
    render(this.#sortingView, this.#container);
  }

  #renderPointsList() {
    render(this.#pointsListViewComponent, this.#container);

    if(this.#points.length === 0) {
      this.#renderEmptyPointsList();
    }

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListViewComponent.element,
      offers: this.#offers,
      destinations: this.#destinations
    });

    pointPresenter.init(point);
  }

  #renderEmptyPointsList() {
    render(this.#noPointViewComponent, this.#pointsListViewComponent.element);
  }

  #renderPoints(from, to) {
    this.#points.slice(from, to).forEach((point) => this.#renderPoint(point));
  }
}
