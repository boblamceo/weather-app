export const last = (arr) => arr[Object.keys(arr)[Object.keys(arr).length - 1]];
export const degreesrotation = (original, data) =>
  original + data > 359 ? original + data - 360 : original + data;
export const directionToLetters = (direction) => {
  if (!direction) {
    return [];
  }
  function mode(array) {
    if (array.length == 0) return null;
    var modeMap = {};
    var maxEl = array[0],
      maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      if (modeMap[el] == null) modeMap[el] = 1;
      else modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  }
  const arr = direction.split("");
  if (arr.length === 3) {
    return [mode(arr)];
  } else {
    return arr;
  }
};
