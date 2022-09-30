const { fromEvent, Error: BaconError, combineAsArray, fromPromise, fromCallback, once, mergeAll } = Bacon;
const URL = "";

/* lógica principal */
const buildBussinessLogicStream = (expInput, valInput) => {
  fromEvent(expInput, "change")
    .map(evt => evt.target.value)
    .map(CellParser.parse)
    .map(readParams)
    .flatMap(calculate)
    .onValue(val => displayValue(val, valInput));
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

const readParams = (valObj) => {
  if (valObj.isNumber()) {
    return { type: 0, value: valObj.value };
  } else if (valObj.isReference()) {
    const val = document.getElementById(valObj.value).value;

    return { type: 1, value: Number(val) };
  } else if (valObj.isOperation()) {
    const { operation, params } = valObj.value;

    return { type: 2, value: { operation: operation, params: params.map(val => readParams(val)) } };
  } else if (valObj.isError()) {
    return { type: 3, value: valObj.value };
  }
}

const calculate = (valObj) => {
  const { type, value } = valObj;
  
  if (type === 2) {
    const { operation, params } = value;

    return fromPromise(fetch(`http://localhost:3001/${operation.toLowerCase()}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ params })
    }).then(response => response.json()));
  } else if (type === 3) {
    return once({ result: 'error' });
  } else {
    return once({ result: value });
  }
}

const displayValue = (expValue, valInput) => {
  const { result } = expValue;

  if (result === 'error') {
    valInput.value = "#ERROR";
  } else {
    valInput.value = result;
  }
}