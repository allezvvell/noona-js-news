const API_KEY = 'c9a1f2b800e74037a62f70fd4762c1de';
let newsList = [];
let newsCategory = '';

const searchButton = document.querySelector('.search-btn');
const searchForm = document.querySelector('.search-form');
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
mainMenu.addEventListener('click', changeCategory);
mobileMenu.addEventListener('click', changeCategory);

fetchNews();

async function fetchNews() {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${newsCategory}`
  );
  try {
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
  } catch (error) {
    console.log(error);
  }
}

function render() {
  let result = '';
  if (newsList.length === 0) {
    result = `<p class='no-news'>해당 카테고리에 뉴스가 없습니다</p>`;
  } else {
    newsList.forEach((item) => {
      result += `<li class="row">
            <div class="col-lg-4 left">
              <img src=${
                item.urlToImage || 'images/noImage.jpg'
              } onError="this.src='images/noImage.jpg';" alt='뉴스이미지'/>
            </div>
            <div class="col-lg-8 right">
              <h2>${item.title}</h2>
              <p>${
                !item.description
                  ? '내용 없음'
                  : item.description.length > 200
                  ? item.description.substr(0, 200) + '...'
                  : item.description
              }</p>
              <div>
                <span class="author">${item.source.name || 'no source'}</span
                ><span class="date">${moment(item.publishedAt).fromNow()}</span>
              </div>
            </div>
          </li>`;
    });
  }
  newsArea.innerHTML = result;
}

function changeCategory(e) {
  if (e.target.tagName === 'BUTTON') {
    newsCategory = e.target.textContent;
    fetchNews();
  }
}

function toggleSearchForm() {
  if (searchForm.matches('.active')) {
    searchForm.classList.remove('active');
  } else {
    searchForm.classList.add('active');
  }
}
