import imagesCards from '../templates/imagesCards.hbs';
import FetchImagesApi from './fetchImagesApi';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchMachine = new FetchImagesApi();

searchForm.addEventListener('submit', formSubmitHandler);
loadMoreBtn.addEventListener('click', loadMoreBtnClickHandler);
loadMoreBtn.classList.add('is-hidden');

function formSubmitHandler(event) {
  event.preventDefault();
  const { searchQuery } = searchForm.elements;
  const queryFromForm = searchQuery.value.trim();
  searchMachine.page = 1;
  searchMachine.query = queryFromForm;
  searchMachine
    .fetchImages()
    .then(({ data: { hits, total } }) => {
      const totalPages = Math.ceil(total / searchMachine.perPage);
      if (totalPages === 0) {
        galleryContainer.innerHTML = '';
        loadMoreBtn.classList.add('is-hidden');
        loadMoreBtn.removeEventListener(loadMoreBtnClickHandler);
        return;
      }
      galleryContainer.innerHTML = imagesCards(hits);
      if (totalPages > searchMachine.page) {
        loadMoreBtn.classList.remove('is-hidden');
        searchMachine.page += 1;
      }
    })
    .catch(error => console.log(error.message));
}

function loadMoreBtnClickHandler() {
  searchMachine.fetchImages().then(({ data: { hits, total } }) => {
    const totalPages = Math.ceil(total / searchMachine.perPage);
    galleryContainer.insertAdjacentHTML('beforeend', imagesCards(hits));
    if (totalPages === searchMachine.page) {
      alert("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('is-hidden');
      loadMoreBtn.removeEventListener(loadMoreBtnClickHandler);
      return;
    }
    searchMachine.page += 1;
  });
}
