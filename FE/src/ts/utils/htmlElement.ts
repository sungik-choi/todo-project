interface Textarea {
  id: string;
  maxLength: number;
  placeholder: string;
  value: string;
}

const htmlElements = {
  div: (className: string, ...value: Array<string>): string =>
    `<div class="${className}">${value.reduce((acc: string, cur: string) => {
      acc += cur;
      return acc;
    }, '')}</div>`,
  article: (className: string, ...value: Array<string>): string =>
    `<article class="${className}">${value.reduce((acc: string, cur: string) => {
      acc += cur;
      return acc;
    }, '')}</article>`,
  h2: (className: string, value: string): string => `<h2 class="${className}">${value}</h2>`,
  h3: (className: string, value: string): string => `<h3 class="${className}">${value}</h3>`,
  span: (className: string, ...value: Array<string>): string =>
    `<span class="${className}">${value.reduce((acc: string, cur: string) => {
      acc += cur;
      return acc;
    }, '')}</span>`,
  strong: (value: string): string => `<strong>${value}</strong>`,
  label: (className: string, id: string, value: string): string => `<label class="${className}" for="${id}">${value}</label>`,
  textarea: (property: Textarea): string => `<textarea name="${property.id}" id="${property.id}" maxlength="${property.maxLength}" placeholder="${property.placeholder}">${property.value}</textarea>`,
  button: (className: string, value: string): string => `<button class="${className}" tabindex="0">${value}</button>`,
  icon: (className: string, value: string): string => `<i class="${className}">${value}</i>`,
};

export default htmlElements;
