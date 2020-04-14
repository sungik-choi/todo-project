import { _q, addClass, removeClass } from '../utils/utils';
import { CARD_CLASS } from './card';
import htmlElements from '../utils/htmlElement';

interface DragProperty {
  targetElement: any;
  cloneElement: any;
  isMousePressed: boolean;
  isVisible: boolean;
}

const dragProperty: DragProperty = {
  targetElement: null,
  cloneElement: null,
  isMousePressed: false,
  isVisible: false,
};

const DRAG_CLASS = {
  clone: 'clone',
  transparent: 'transparent',
  outlined: 'outlined',
  dragShield: 'drag-shield',
};

const MOUSE_RIGHT_BUTTON_CODE = 2;

const cloneCardElement = ({ target }: Event): void => {
  dragProperty.targetElement = target;
  dragProperty.cloneElement = target.cloneNode(true);
};

const setCloneElementSize = (targetElement: HTMLElement, cloneElement: HTMLElement): void => {
  cloneElement.style.width = `${targetElement.offsetWidth}px`;
  cloneElement.style.height = `${targetElement.offsetHeight}px`;
};

const insertCloneElement = (containerElement: HTMLElement, cloneElement: HTMLElement): void => {
  containerElement.insertAdjacentHTML('afterbegin', htmlElements.div(DRAG_CLASS.dragShield));
  containerElement.appendChild(cloneElement);
};

const addOpacityClass = (targetElement: HTMLElement, cloneElement: HTMLElement): void => {
  addClass(DRAG_CLASS.transparent, targetElement);
  addClass(DRAG_CLASS.clone, cloneElement);
};

const updateCloneElementPosition = (event: MouseEvent, cloneElement: HTMLElement): void => {
  const posX = event.clientX - cloneElement.offsetWidth / 2;
  const posY = event.clientY - cloneElement.offsetHeight / 2;
  cloneElement.style.transform = `translate(${posX}px, ${posY}px)`;
};

const revertToOriginState = (targetElement: HTMLElement): void => {
  targetElement.querySelector(`.${DRAG_CLASS.dragShield}`).remove();
  dragProperty.cloneElement.remove();
  dragProperty.isVisible = false;
  dragProperty.isMousePressed = false;
  removeClass(DRAG_CLASS.transparent, dragProperty.targetElement);
};

const mouseDownCard = (event: MouseEvent): void => {
  if (event.buttons === MOUSE_RIGHT_BUTTON_CODE) return;
  if (!event.target.classList.contains(CARD_CLASS.card)) return;
  dragProperty.isMousePressed = true;
  cloneCardElement(event);
  setCloneElementSize(dragProperty.targetElement, dragProperty.cloneElement);
};

const mouseMoveCard = (event: MouseEvent, containerElement: HTMLElement): void => {
  if (!dragProperty.isMousePressed) return;
  if (!dragProperty.isVisible) {
    dragProperty.isVisible = true;
    addOpacityClass(dragProperty.targetElement, dragProperty.cloneElement);
    insertCloneElement(containerElement, dragProperty.cloneElement);
  }
  updateCloneElementPosition(event, dragProperty.cloneElement);
};

const mouseUpCard = (event: MouseEvent, targetElement: HTMLElement): void => {
  if (!dragProperty.isMousePressed) return;
  revertToOriginState(targetElement);
};

const applyDragAndDrop = (targetElement: HTMLElement): void => {
  targetElement.addEventListener('mousedown', mouseDownCard);
  targetElement.addEventListener('mousemove', event => mouseMoveCard(event, targetElement));
  targetElement.addEventListener('mouseup', event => mouseUpCard(event, targetElement));
};

export default applyDragAndDrop;