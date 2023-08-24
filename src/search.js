import axios from 'axios';

const API_KEY = '39039706-642a8919457a778e8308a3f03';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchData(search) {
  const data = await axios(
    `${BASE_URL}?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true`
  );

  console.log(data);
  
  return data;
}
