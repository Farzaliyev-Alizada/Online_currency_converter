
const fromAmountInput = document.querySelector('#from-amount');
const toAmountInput = document.querySelector('#to-amount');
let currentActiveElement = null;

const fromCurrencyOptions = document.querySelectorAll('.from-currency li');
const toCurrencyOptions = document.querySelectorAll('.to-currency li');

addEventCurrency(fromCurrencyOptions);
addEventCurrency(toCurrencyOptions);

fromAmountInput.addEventListener('input', convert);
toAmountInput.addEventListener('input', convert);

document.querySelector('.reverse').addEventListener('click', () => {
  // Swap the selected currencies
  const { fromCurrency, toCurrency } = selectCurrencies();
  changeCurrency(fromCurrencyOptions, toCurrency);
  changeCurrency(toCurrencyOptions, fromCurrency);
  // Swap the input values
  const temp = fromAmountInput.value;
  fromAmountInput.value = toAmountInput.value;
  toAmountInput.value = temp;
  // Call the convert function to update the converted amount
  convert();
});

async function convert(event) {
  const { fromCurrency, toCurrency } = selectCurrencies();
  if (event) {
    currentActiveElement = event.target;
  };
  const currentValue = +currentActiveElement.value
  // Calculate the conversion based on which input was last updated
  if (currentActiveElement.id === 'from-amount') {
    if (!isNaN(currentValue)) {
      exchangeRate(currentActiveElement, fromCurrency, toCurrency, toAmountInput)
    } else {
      toAmountInput.value = '';
    }
  } else if (currentActiveElement.id === 'to-amount') {
    if (!isNaN(currentValue)) {
      exchangeRate(currentActiveElement, toCurrency, fromCurrency, fromAmountInput)
    } else {
      fromAmountInput.value = '';
    }
  }
}

function addEventCurrency(currencyList) {
  currencyList.forEach(li => {
    li.addEventListener('click', () => {
      changeCurrency(currencyList, li.dataset.currency)
      convert();
    });
  });
}

function changeCurrency(currencyList, currentCurrency) {
  for (const option of currencyList) {
    if (option.dataset.currency === currentCurrency) {
      option.classList.add('selected')
    }
    if (option.dataset.currency !== currentCurrency) {
      option.classList.remove('selected');
    }
  }
}

function selectCurrencies() {
  const fromCurrencyOption = document.querySelector('.from-currency .selected');
  const toCurrencyOption = document.querySelector('.to-currency .selected');
  const fromCurrency = fromCurrencyOption.dataset.currency;
  const toCurrency = toCurrencyOption.dataset.currency;
  return {
    fromCurrencyOption,
    toCurrencyOption,
    fromCurrency,
    toCurrency
  }
}

async function getCurrentRate(from, to) {
  const apiUrl = `https://api.exchangerate.host/latest?base=${from}&symbols=${to}`;
  const data = await (await fetch(apiUrl)).json()
  return data?.rates?.[to]
}

async function exchangeRate(currentCurrency, from, to, changableEl) {
  const currentCurrencyValue = currentCurrency.value;
  const rate = await getCurrentRate(from, to)
  const convertedAmount = currentCurrencyValue * rate;
  changableEl.value = convertedAmount.toFixed(2);
  const amountVal = 1;
  const exchangeRateFrom = amountVal * rate;
  changableEl.parentElement.children[2].innerText = `${amountVal} ${to}= ${(1 / exchangeRateFrom).toFixed(3)} ${from}`
  currentCurrency.parentElement.children[2].innerText = `${amountVal} ${from}= ${exchangeRateFrom.toFixed(3)} ${to}`
}