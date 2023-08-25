import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '39039706-642a8919457a778e8308a3f03';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchData(searchInput, page) {
		const data = await axios(
			`${BASE_URL}?key=${API_KEY}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
		 );
	
		 return data.data.hits;
}
