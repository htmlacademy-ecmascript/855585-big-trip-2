import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

function humanizeTaskDueDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

function calculatesTravelTimeInMinutes(dateFrom, dateTo) {
  const date1 = dayjs(dateTo);
  return date1.diff(dateFrom, 'minute');
}

function calculatesTravelTime(dateFrom, dateTo) {
  const date1 = dayjs(dateTo);
  const date2 = dayjs(dateFrom);

  const days = date1.diff(date2, 'day');
  const hours = date1.diff(date2.add(days, 'day'), 'hour');
  const minutes = date1.diff(date2.add(days, 'day').add(hours, 'hour'), 'minute');

  return `${days ? `${days}D` : ''} ${hours ? `${hours}H` : ''} ${minutes}`;
}

function isPointsPassed(dueDate) {
  const now = dayjs();
  return dayjs(dueDate).isBefore(now, 'day');
}

function isPointsPlanned(dueDate) {
  const now = dayjs();
  return dayjs(dueDate).isAfter(now, 'day');
}

function isPointsCurrent(startDate, endDate) {
  const now = dayjs();
  return now.isBetween(dayjs(startDate), dayjs(endDate), 'day', '[]');
}

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortPointByDate(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dateTo, pointB.dateTo);

  return weight ?? dayjs(pointB.dateTo).diff(dayjs(pointA.dateTo));
}

function sortPointByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortPointByTime(pointA, pointB) {
  const durationA = calculatesTravelTimeInMinutes(pointA.dateFrom, pointA.dateTo);
  const durationB = calculatesTravelTimeInMinutes(pointB.dateFrom, pointB.dateTo);
  return durationB - durationA;
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export {humanizeTaskDueDate, calculatesTravelTime, isPointsPassed, isPointsPlanned, isPointsCurrent, sortPointByDate, sortPointByPrice, sortPointByTime, isDatesEqual};
