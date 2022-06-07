import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import imagesCards from '../templates/imagesCards.hbs';
import FetchImagesApi from './fetchImagesApi';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchMachine = new FetchImagesApi();
const gallery = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', formSubmitHandler);
loadMoreBtn.classList.add('is-hidden');

async function formSubmitHandler(event) {
  event.preventDefault();
  const { searchQuery } = searchForm.elements;
  const queryFromForm = searchQuery.value.trim();

  searchMachine.page = 1;
  searchMachine.query = queryFromForm;

  const res = await searchMachine.fetchImages();
  dubSearchRes(res);
}

async function loadMoreBtnClickHandler() {
  const nextSearchRes = await searchMachine.fetchImages();
  dubNextSearchRes(nextSearchRes);
}

function dubSearchRes({ data: { hits, total } }) {
  try {
    const totalPages = Math.ceil(total / searchMachine.perPage);
    if (totalPages === 0 || searchMachine.query === '') {
      galleryContainer.innerHTML = '';
      loadMoreBtn.classList.add('is-hidden');
      loadMoreBtn.removeEventListener('click', () => loadMoreBtnClickHandler());
      setTimeout(() => {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }, 0);
      return;
    }

    setTimeout(() => {
      Notify.success(`Hooray! We found ${total} images.`);
    }, 0);
    galleryContainer.innerHTML = imagesCards(hits);

    gallery.refresh();

    const { height: totalGalleryHeight } =
      galleryContainer.getBoundingClientRect();

    window.scrollBy({
      top: totalGalleryHeight,
      behavior: 'smooth',
    });

    if (totalPages === searchMachine.page) {
      setTimeout(
        () =>
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          ),
        1000
      );
      loadMoreBtn.classList.add('is-hidden');
      loadMoreBtn.removeEventListener('click', loadMoreBtnClickHandler);
    }

    if (totalPages > searchMachine.page) {
      loadMoreBtn.classList.remove('is-hidden');
      loadMoreBtn.addEventListener('click', loadMoreBtnClickHandler);
      searchMachine.page += 1;
    }
  } catch (error) {
    Notify.failure(error.message);
  }
}

function dubNextSearchRes({ data: { hits, total } }) {
  try {
    const totalPages = Math.ceil(total / searchMachine.perPage);
    galleryContainer.insertAdjacentHTML('beforeend', imagesCards(hits));
    gallery.refresh();

    const { height: totalGalleryHeight } =
      galleryContainer.getBoundingClientRect();

    window.scrollTo({
      top: totalGalleryHeight,
      behavior: 'smooth',
    });

    if (totalPages === searchMachine.page) {
      setTimeout(
        () =>
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          ),
        1000
      );
      loadMoreBtn.classList.add('is-hidden');
      loadMoreBtn.removeEventListener('click', loadMoreBtnClickHandler);
      return;
    }
    searchMachine.page += 1;
  } catch (error) {
    Notify.failure(error.message);
  }
}
