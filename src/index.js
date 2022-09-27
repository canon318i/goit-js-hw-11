import './sass/main.scss';

import Notiflix from 'notiflix';
import hbsGalleryMarkup from './templates/gallery.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '30099425-45e663ebfa49895e0599559cc';
const URL = 'https://pixabay.com/api/?';
let searchString = 'red roses';
const requestParams = {
  params: {
    key: API_KEY,
    image_type: 'photo',
    // orientation: 'horizontal',
    safesearch: 'true',
    per_page: 12,
    page: 1,
    q: '',
    // responseType: 'json',
  },
};

const axios = require('axios');
const gallery = new SimpleLightbox('.gallery a', { captionsData: 'title', captionDelay: 250 });
const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('.search-form'),
  loadMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

function fetchImages(fullURL) {
  axios
    .get(URL, requestParams)
    .then(response => parceResponse(response))
    .then(hits => createGalleryMarkup(hits))
    .then(markup => addGalleryMarkup(refs.gallery, markup))
    .catch(error => console.log(error));
}

function parceResponse(response) {
  console.dir(response);
  if (response.data.totalHits === 0) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`,
    );
    return [];
  }
  if (response.data.totalHits > 0 && response.data.hits.lenght < requestParams.params.per_page) {
    Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
    return [];
  }

  return response.data.hits;
}

function createGalleryMarkup(hits) {
  if (hits.length > 0) return hits.map(hit => hbsGalleryMarkup(hit)).join('');
  Notiflix.Notify.failure(
    `Sorry, there are no images matching your search query. Please try again.`,
  );
  return '';
}

function clearGalleryMarkup(galleryRef) {
  galleryRef.innerHTML = '';
}

function addGalleryMarkup(galleryRef, htmlString) {
  galleryRef.insertAdjacentHTML('beforeend', htmlString);
  gallery.refresh();
}

function onSearch(event) {
  event.preventDefault();
  searchString = event.currentTarget.elements.searchQuery.value;
  requestParams.params.q = encodeURIComponent(searchString);
  requestParams.params.page = 1;
  clearGalleryMarkup(refs.gallery);
  fetchImages(URL);
}

function onLoadMore(event) {
  event.preventDefault();
  requestParams.params.page += 1;
  fetchImages(URL);
}
