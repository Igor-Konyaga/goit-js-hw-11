import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import { fetchData } from './search';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

loadMoreEl.style.display = 'none';

let index = 1;


formEl.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  index = 1;
  const  searchValue = formEl.elements.searchQuery.value;

  try {

    const data = await fetchData(searchValue, index);

    const markup = renderMarkup(data);

	 galleryEl.innerHTML = markup;

	 loadMoreEl.style.display = 'block';

  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

}

function renderMarkup(arr) {
  const markup = arr.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card">
		<img src="${webformatURL}" alt="${tags}" loading="lazy" />
		<div class="info">
		  <p class="info-item">
			 <b>Likes: ${likes}</b>
		  </p>
		  <p class="info-item">
		  <b>Views: ${views}</b>
		  </p>
		  <p class="info-item">
		  <b>Comments: ${comments}</b>
		  </p>
		  <p class="info-item">
		  <b>Downloads: ${downloads}</b>
		  </p>
		  </div>
		  </div>`;
    }
  );

  return markup;
}

loadMoreEl.addEventListener('click', onLoadMore);

async function onLoadMore (e) {
	const searchValue = formEl.children[0].value;
	index += 1;

loadMoreEl.disabled = true;

const data = await fetchData(searchValue, index);

const markup = renderMarkup(data);

galleryEl.insertAdjacentHTML('beforeend', markup);

loadMoreEl.disabled = false;

console.log(index)
}