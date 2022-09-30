export default class LoadMoreBtn {
  constructor({ selector, hidden = true }) {
    this.refs = this.getRefs(selector);
    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.spinner = refs.button.querySelector('.spinner');
    refs.label = refs.button.querySelector('.label');
    return refs;
  }

  show() {
    this.refs.button.classList.remove('visually-hidden');
  }

  hide() {
    this.refs.button.classList.add('visually-hidden');
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.label.textContent = 'Load More';
  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.label.textContent = 'Loading...';
  }
}
