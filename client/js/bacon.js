const { fromEvent, Error: BaconError, combineAsArray, fromPromise, once, mergeAll } = Bacon;
const URL = "";

/* lógica principal */
const buildBussinessLogicStream = (expInput, valInput) => {
  fromEvent(expInput, "change")
    .map(evt => evt.target.value)
    .flatMap(calculate)
    .map(response => response.json())
    .onValue(val => {
      console.log(val);
      displayValue(val, valInput);
  });
}

const buildEnterExitStreams = (cell, expInput, valInput) => {
  mergeAll(
    fromEvent(cell, "click").map(_ => 1),
    fromEvent(expInput, "blur").map(_ => 2)
  ).onValue(opt => {
    if (opt === 1) {
      [valInput.hidden, expInput.hidden] = [true, false];
      expInput.focus();
    } else {
      [valInput.hidden, expInput.hidden] = [false, true];
    }
  })

  fromEvent(expInput, "keydown")
    .filter(evt => evt.key == "Enter" || evt.keyCode === 13)
    .map(evt => evt.target.value)
    .diff("", (prevVal, currVal) => prevVal != currVal) //todas as células começam com string vazias
    .onValue(isDifferent => {
      if (isDifferent) { //apenas emite se de fato houve mudança
        expInput.dispatchEvent(new Event("change"));
      }
      expInput.blur();
    });
}

const calculate = (value) => {
  const valObj = CellParser.parse(value);

  return fromPromise(fetch('http://localhost:3001/add', {
    method: 'POST',
    mode: 'cors',
    body: { json: JSON.stringify(1) }
  }));
}

const displayValue = (expValue, valInput) => {
  valInput.value = expValue.result;
}