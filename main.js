const API_KEY = 'c9a1f2b800e74037a62f70fd4762c1de';
let newsList = [];

async function fetchNews() {
  const url = new URL(
    `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`
  );
  try {
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
  } catch (error) {
    console.log(error);
  }
}

fetchNews();
