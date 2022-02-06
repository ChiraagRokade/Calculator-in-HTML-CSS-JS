const buttons = document.querySelectorAll('button');
const display = document.querySelector('.display');
buttons.forEach(function (button) {
  button.addEventListener('click', calculate);
});
function calculate (event) {
  const clickButtonValue = event.target.value;
  if (clickButtonValue === '=') {
    if (display.value !== '') {
      display.value = eval(display.value);
    }
  } else if (clickButtonValue === 'C') {
    display.value = '';
  } else {
    display.value += clickButtonValue;
  }
}