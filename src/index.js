import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchData } from './search';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');
const resetEl = document.querySelector('.reset');

loadMoreEl.style.display = 'none';

let index = 1;

formEl.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  index = 1;
  const searchValue = formEl.elements.searchQuery.value.trim();

if (searchValue === '') {
	Notiflix.Notify.warning('Fill in the field!');
	formEl.reset()
	return;
}

  try {
    const data = await fetchData(searchValue, index);

	 console.log(searchValue)

    if (data.totalHits === 0) {
      galleryEl.innerHTML = '';

      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      loadMoreEl.style.display = 'none';

      formEl.reset();

      return;
    }

    const markup = renderMarkup(data.hits).join('');

    galleryEl.innerHTML = markup;

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    let lightbox = new SimpleLightbox('.gallery a');

    loadMoreEl.style.display = 'block';
  } catch (error) {
    Notiflix.Notify.failure(error.message);
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
		<a href=${largeImageURL}><img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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

async function onLoadMore(e) {
  const searchValue = formEl.children[0].value;
  index += 1;

  loadMoreEl.disabled = true;

  const data = await fetchData(searchValue, index);

  const markup = renderMarkup(data.hits).join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  let lightbox = new SimpleLightbox('.gallery a');

  if (data.totalHits < index * 40 || data.totalHits === index * 40) {
    loadMoreEl.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  loadMoreEl.disabled = false;
}

resetEl.addEventListener('click', () => {
  formEl.reset();
  loadMoreEl.style.display = 'none';
  galleryEl.innerHTML = '';
});
