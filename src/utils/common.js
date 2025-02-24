function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInteger(integer) {
  return Math.floor(Math.random() * integer);
}

const isEscapeKey = (evt) => evt.keyCode === 27;

export {getRandomArrayElement, getRandomInteger, isEscapeKey};
