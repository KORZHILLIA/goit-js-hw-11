const axios = require('axios');

export default class FetchImagesApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #PERSONAL_KEY = '27083627-728c5d78e0dae05c6569d7d6c';
  constructor() {}
  page = 1;
  query = null;
  perPage = 40;

  async fetchImages() {
    const searchParams = new URLSearchParams({
      q: this.query,
      page: this.page,
      per_page: this.perPage,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    const response = await axios.get(
      `${this.#BASE_URL}?key=${this.#PERSONAL_KEY}&${searchParams}`
    );
    if (response.status !== 200) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    console.log(response);
    return response;
  }
}
