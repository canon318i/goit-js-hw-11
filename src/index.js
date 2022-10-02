import './sass/main.scss';

import Notiflix from 'notiflix';
import hbsGalleryMarkup from './templates/gallery.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './components/_load_more_btn';

const API_KEY = '30099425-45e663ebfa49895e0599559cc';
const URL = 'https://pixabay.com/api/?';
const requestParams = {
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 12,
    page: 1,
    q: '',
  },
  resetPage() {
    this.params.page = 1;
  },
  nextPage() {
    this.params.page += 1;
  },
  setQueryString(searchString) {
    this.params.q = searchString;
  },
};

const axios = require('axios');
const gallery = new SimpleLightbox('.gallery a', { captionsData: 'title', captionDelay: 250 });
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more' });

Notiflix.Notify.init({
  position: 'right-bottom',
});

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('.search-form'),
  loadMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

async function fetchImages(URL, requestParams) {
  return axios.get(URL, requestParams);
}

async function parceResponse(response) {
  if (response.data.totalHits === 0) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`,
    );
    return [];
  }
  // if (response.data.totalHits > 0 && response.data.hits.length < requestParams.params.per_page) {
  if (response.data.totalHits > 0 && response.data.hits.length === 0) {
    Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
    return [];
  }
  if (response.data.totalHits > 0 && response.config.params.page === 1) {
    Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
  }

  return response.data.hits;
}

async function createGalleryMarkup(hits) {
  return hits.map(hbsGalleryMarkup).join('');
}

function clearGalleryMarkup(galleryRef) {
  galleryRef.innerHTML = '';
}

async function addGalleryMarkup(galleryRef, htmlString) {
  galleryRef.insertAdjacentHTML('beforeend', htmlString);
  gallery.refresh();
}

async function scrollPage() {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}

async function onSearch(event) {
  event.preventDefault();
  requestParams.setQueryString(event.currentTarget.elements.searchQuery.value);
  requestParams.resetPage();
  clearGalleryMarkup(refs.gallery);
  try {
    await loadMoreBtn.hide();
    const response = await fetchImages(URL, requestParams);
    const hits = await parceResponse(response);
    const markup = await createGalleryMarkup(hits);
    await addGalleryMarkup(refs.gallery, markup);
    await loadMoreBtn.show();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore(event) {
  event.preventDefault();
  requestParams.nextPage();
  try {
    await loadMoreBtn.disable();
    const response = await fetchImages(URL, requestParams);
    const hits = await parceResponse(response);
    const markup = await createGalleryMarkup(hits);
    await addGalleryMarkup(refs.gallery, markup);
    await scrollPage();
    await loadMoreBtn.enable();
  } catch (error) {
    console.log(error);
  }
}
