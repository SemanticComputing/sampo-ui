import _ from 'lodash';
import './style.css';
import test from './test';

function component() {
  const element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const testElement = document.createElement('p');
  testElement.innerHTML = test();
  element.appendChild(testElement);

  return element;
}

document.body.appendChild(component());
