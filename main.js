const API_KEY = 'c9a1f2b800e74037a62f70fd4762c1de';
let newsList = [];

async function fetchNews() {
  const url = new URL(`https://noona-js-news.netlify.app/top-headlines`);
  try {
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    console.log(newsList);
  } catch (error) {
    console.log(error);
  }
}

fetchNews();
