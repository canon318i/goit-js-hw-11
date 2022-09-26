import './sass/main.scss';

import Notiflix from 'notiflix';
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

Notiflix.Notify.info('Notiflix is working');
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

function fetchImages(fullURL) {
  axios
    .get(URL, requestParams)
    .then(function (response) {
      console.dir(response);
      return response.data.hits.map(destructHitsArray);
    })
    .then(function (hits) {
      console.dir(hits);
      return createGalleryMarkup(hits);
    })
    .then(function (markup) {
      // console.dir(markup);
      addGalleryMarkup(refs.gallery, markup);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function destructHitsArray(hit) {
  const {
    webformatURL: src,
    largeImageURL: href,
    tags: alt,
    likes,
    views,
    comments,
    downloads,
  } = hit;
  return { src, href, alt, likes, views, comments, downloads };
}

function createGalleryMarkup(hits) {
  return hits
    .map(({ src, href, alt, likes, views, comments, downloads }) => {
      return `
            <a class="gallery__item" href="${href}">
              <img class="gallery__image" src="${src}" alt="${alt}" title="${alt}" loading="lazy"/>
              <div class="gallery__info">
              <p class="info__item">
                <b>Likes </b><br>${likes}
              </p>
              <p class="info__item">
                <b>Views </b><br>${views}
              </p>
              <p class="info__item">
                <b>Comments </b><br>${comments}
              </p>
              <p class="info__item">
                <b>Downloads </b><br>${downloads}
              </p>
              </div>
            </a>
            `;
    })
    .join('');
}

function clearGalleryMarkup(galleryRef) {
  galleryRef.innerHTML = '';
}

function addGalleryMarkup(galleryRef, htmlString) {
  galleryRef.insertAdjacentHTML('beforeend', htmlString);
  gallery.refresh();
  console.log(gallery.refresh());
}

function onSearch(event) {
  event.preventDefault();
  searchString = event.currentTarget.elements.searchQuery.value;
  console.dir(searchString);
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
