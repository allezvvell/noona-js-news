const API_KEY = 'c9a1f2b800e74037a62f70fd4762c1de';
let newsList = [];
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
);

const searchButton = document.querySelector('.search-btn');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const mainMenu = document.querySelector('.menu');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuOpenButton = document.querySelector('.mobile-menu-btn');
const mobileMenuCloseButton = document.querySelector('.close-btn');
const newsArea = document.querySelector('.news-list');

searchButton.addEventListener('click', toggleSearchForm);
mobileMenuOpenButton.addEventListener('click', () => {
  mobileMenu.style.marginLeft = '0';
});
mobileMenuCloseButton.addEventListener('click', () => {
  mobileMenu.style.marginLeft = '-100%';
});
mainMenu.addEventListener('click', getNewsByCategory);
mobileMenu.addEventListener('click', getNewsByCategory);
searchForm.addEventListener('submit', getNewsByKeyword);

getHeadlineNews();

function getHeadlineNews() {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
  );
  fetchNews();
}

function getNewsByCategory(e) {
  if (e.target.tagName !== 'BUTTON') return;
  const category = e.target.textContent;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`
  );
  fetchNews();
}

function getNewsByKeyword(e) {
  e.preventDefault();
  const keyword = document.querySelector('.search-input').value.trim();
  if (keyword.length === 0) return;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`
  );
  fetchNews(keyword);
  document.querySelector('.search-input').value = '';
}

async function fetchNews(keyword) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0)
        throw new Error('No matches for your search');
      newsList = data.articles;
      render(keyword);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    renderError(error.message);
  }
}

function render(keyword) {
  let result = '';
  newsList.forEach((item) => {
    const title =
      keyword === undefined ? item.title : markKeyword(keyword, item.title);
    let desc = !item.description
      ? '내용 없음'
      : item.description.length > 200
      ? item.description.substr(0, 200) + '...'
      : item.description;
    desc = keyword === undefined ? desc : markKeyword(keyword, desc);
    result += `<li class="row">
            <div class="col-lg-4 left">
              <img src=${
                item.urlToImage || 'images/noImage.jpg'
              } onError="this.src='images/noImage.jpg';" alt='뉴스이미지'/>
            </div>
            <div class="col-lg-8 right">
              <h2>${title}</h2>
              <p>${desc}</p>
              <div>
                <span class="author">${item.source.name || 'no source'}</span
                ><span class="date">${moment(item.publishedAt).fromNow()}</span>
              </div>
            </div>
          </li>`;
  });
  newsArea.innerHTML = result;
}

function renderError(errorMessage) {
  const result = `<div class="alert alert-danger" role="alert" style="text-align:center;margin-top:0.5rem">${errorMessage}</div>`;
  newsArea.innerHTML = result;
}

function markKeyword(keyword, txt) {
  let index = txt.indexOf(keyword);
  while (index !== -1) {
    const start = '<span class="yellow">';
    const end = '</span>';
    txt =
      txt.slice(0, index) +
      start +
      txt.slice(index, index + keyword.length) +
      end +
      txt.slice(index + keyword.length, txt.length);
    index = txt.indexOf(keyword, index + start.length + 1);
  }
  return txt;
}

function toggleSearchForm() {
  if (searchForm.matches('.active')) {
    searchForm.classList.remove('active');
  } else {
    searchForm.classList.add('active');
  }
}
