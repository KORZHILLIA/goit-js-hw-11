import axios from 'axios';

export default class FetchImagesApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #PERSONAL_KEY = '27083627-728c5d78e0dae05c6569d7d6c';
  page = 1;
  query = null;
  perPage = 40;

  fetchImages() {
    const response = axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#PERSONAL_KEY,
        q: this.query,
        page: this.page,
        per_page: this.perPage,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return response;
  }
}
