const isBetweenTimestamps = (actual, start, end) => {
  const _actual = new Date(actual);
  return ((_actual - new Date(start) > 0) && (new Date(end) - _actual > 0));
}

module.exports = {
  isBetweenTimestamps
}