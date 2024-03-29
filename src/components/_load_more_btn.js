export default class LoadMoreBtn {
  constructor({ selector, hidden = true }) {
    this.refs = this.getRefs(selector);
    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.label = refs.button.querySelector('.label');
    refs.spinner = refs.button.querySelector('.spinner');
    return refs;
  }

  async show() {
    this.refs.button.classList.remove('visually-hidden');
  }

  async hide() {
    this.refs.button.classList.add('visually-hidden');
  }

  async enable() {
    this.refs.button.disabled = false;
    this.refs.label.textContent = 'Load more';
    this.refs.spinner.classList.add('visually-hidden');
  }

  async disable() {
    this.refs.button.disabled = true;
    this.refs.label.textContent = 'Loading ...';
    this.refs.spinner.classList.remove('visually-hidden');
  }
}
