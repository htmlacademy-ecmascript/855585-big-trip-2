import dayjs from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInteger(integer) {
  return Math.floor(Math.random() * integer);
}

function humanizeTaskDueDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

function calculatesTravelTime(dateFrom, dateTo) {
  const date1 = dayjs(dateTo);
  return date1.diff(dateFrom, 'minute');
}


function createFormOffersTemplate(pointOffers, point) {
  return pointOffers
    .map((offer) => {
      const checked = point.includes(offer.id) ? 'checked' : '';
      return `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${checked}>
                        <label class="event__offer-label" for="${offer.id}">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
    }).join('');
}

function createDestinationList(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');
}

function createEventTypeItem (offers) {
  return offers.map((offer) => `<div class="event__type-item">
  <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}">
  <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${(offer.type)[0].toUpperCase() + (offer.type).slice(1)}</label>
</div>`).join('');
}

export {getRandomArrayElement, getRandomInteger, humanizeTaskDueDate, calculatesTravelTime, createFormOffersTemplate, createDestinationList, createEventTypeItem};
