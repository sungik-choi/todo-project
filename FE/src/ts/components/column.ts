import { ICON_TYPE, UTIL_CLASS, DATA_ATTRIBUTE } from '../utils/constants';
import { _q, toggleClass } from '../utils/utils';
import htmlElements from '../utils/htmlElement';
import { inputFormElement, textareaElement, templateInputFormElement } from './inputForm';
import { Card, DEFAULT_CARD_CONTENTS, templateCardElement, templateAllCardElement } from './card';
import { updateActivityList } from './sidemenu';
import { Sections, fetchAddedCard } from './fetch';
import { initialRenderTodoList } from './columnWrap';

export const COLUMN_CLASS = {
  column: 'column',
  titleWrap: 'column-title-wrap',
  cardCount: 'column-number',
  title: 'column-title',
  buttonWrap: 'column-button-wrap',
  addButton: 'edit-btn icon-secondary-btn material-icons',
  deleteButton: 'delete-btn icon-secondary-btn material-icons',
  cardWrap: 'card-wrap',
};

const COLUMN_ATOM = {
  titleAtoms: (atoms: string): string => htmlElements.div(COLUMN_CLASS.titleWrap, atoms),
  cardCount: (count: number): string => htmlElements.div(COLUMN_CLASS.cardCount, count),
  title: (name: string): string => htmlElements.h2(COLUMN_CLASS.title, name),
  buttons: htmlElements.div(COLUMN_CLASS.buttonWrap, htmlElements.button(COLUMN_CLASS.addButton, ICON_TYPE.add), htmlElements.button(COLUMN_CLASS.deleteButton, ICON_TYPE.delete)),
  inputForm: templateInputFormElement(),
  cards: (id: number, cards: Array<Card>): string => htmlElements.div(COLUMN_CLASS.cardWrap, templateAllCardElement(id, cards)),
};

export const getColumnId = (target: HTMLElement): number => parseInt(target.dataset.columnId, 10);

export const columnElement = (target: EventTarget): HTMLElement => target.closest(`.${COLUMN_CLASS.column}`);

export const cardWrapElement = (columnElement: HTMLElement): HTMLElement => columnElement.querySelector(`.${COLUMN_CLASS.cardWrap}`);

export const templateColumnElement = ({ id, name, card }: Sections): string => {
  const cardCount: number = Object.keys(card).length;
  return `<div ${DATA_ATTRIBUTE.columnId}="${id}" class="${COLUMN_CLASS.column}">
  ${COLUMN_ATOM.titleAtoms(`${COLUMN_ATOM.cardCount(cardCount)}${COLUMN_ATOM.title(name)}${COLUMN_ATOM.buttons}`)}
  ${COLUMN_ATOM.inputForm}
  ${COLUMN_ATOM.cards(id, card)}</div>`;
};

export const changeCardCount = (targetColumn: HTMLElement): void => {
  const countElement: HTMLElement = targetColumn.querySelector(`.${COLUMN_CLASS.cardCount}`);
  const cardWrapElement: HTMLElement = targetColumn.querySelector(`.${COLUMN_CLASS.cardWrap}`);
  const cardCount: number = cardWrapElement.childElementCount;
  countElement.innerHTML = String(cardCount);
};

const clickColumnAddButton = ({ target }: Event): void => {
  if (target.className !== COLUMN_CLASS.addButton) return;
  const targetColumn: HTMLElement = columnElement(target);
  toggleClass(UTIL_CLASS.hidden, inputFormElement(targetColumn));
  textareaElement(targetColumn).focus();
};

export const addNewCard = async (targetColumn: HTMLElement, cardWrap: HTMLElement, textarea: HTMLTextAreaElement): Promise<void> => {
  try {
    const columnId = getColumnId(targetColumn);
    const addedCardData = await fetchAddedCard({ columnId: columnId, title: textarea.value, contents: DEFAULT_CARD_CONTENTS });
    textarea.setAttribute('disabled', true);
    cardWrap.insertAdjacentHTML('afterbegin', templateCardElement(columnId, addedCardData));
    changeCardCount(targetColumn);
  } catch (err) {
    console.error(err);
    initialRenderTodoList();
  }
  textarea.value = '';
  textarea.removeAttribute('disabled');
  updateActivityList();
};

export const columnClickHandler = (event: Event): void => {
  clickColumnAddButton(event);
};
