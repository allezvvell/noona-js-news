const API_KEY = 'c9a1f2b800e74037a62f70fd4762c1de';
const PAGE_SIZE = 10;
let newsList = [];
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
);
let keyword = undefined;
let totalResults = undefined;
let currentPage = 1;

const searchButton = document.querySelector('.search-btn');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const mainMenu = document.querySelector('.menu');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuOpenButton = document.querySelector('.mobile-menu-btn');
const mobileMenuCloseButton = document.querySelector('.close-btn');
const newsArea = document.querySelector('.news-list');
const pagination = document.querySelector('.pagination');

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

async function getHeadlineNews() {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
  );
  await fetchNews();
}

async function getNewsByCategory(e) {
  if (e.target.tagName !== 'BUTTON' || e.target.matches('.active')) return;
  const category = e.target.textContent;
  keyword = undefined;
  currentPage = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`
  );
  await fetchNews();
}

async function getNewsByKeyword(e) {
  e.preventDefault();
  if (searchInput.value.trim().length === 0) return;
  keyword = searchInput.value.trim();
  currentPage = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`
  );
  await fetchNews();
  searchInput.value = '';
}

async function fetchNews() {
  try {
    url.searchParams.set('page', currentPage);
    url.searchParams.set('pageSize', PAGE_SIZE);
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0)
        throw new Error('No matches for your search');
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      renderPagination();
      resetMenu();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    renderError(error.message);
  }
}

function render() {
  let result = '';
  newsList.forEach((item) => {
    const title = keyword === undefined ? item.title : markKeyword(item.title);
    let desc = !item.description
      ? '내용 없음'
      : item.description.length > 200
      ? item.description.substr(0, 200) + '...'
      : item.description;
    desc = keyword === undefined ? desc : markKeyword(desc);
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
  pagination.innerHTML = '';
  resetMenu();
}

function renderPagination() {
  const GROUP_SIZE = 5;
  const currentGroup = Math.ceil(currentPage / GROUP_SIZE);
  const lastPage = Math.ceil(totalResults / PAGE_SIZE);
  const lastGroup = Math.ceil(lastPage / GROUP_SIZE);
  let result = '';
  if (lastPage > GROUP_SIZE) {
    result = `${
      currentGroup === 1
        ? ''
        : '<li class="page-item"><a class="page-link" href="#" onclick="moveToPage(event,1)">&lt;&lt;</a></li>'
    }
  <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
  <a class="page-link" href="#" onclick="moveToPage(event,${
    currentPage - 1
  })">&lt;</a>
  </li>`;
  }
  for (let i = 1; i <= GROUP_SIZE; i++) {
    const thisPage =
      currentGroup === lastGroup && lastGroup !== 1
        ? i + (lastPage - GROUP_SIZE)
        : i + (currentGroup - 1) * GROUP_SIZE;
    result += `<li class="page-item ${
      thisPage === currentPage ? 'active' : ''
    }"><a class="page-link" href="#" onclick="moveToPage(event,${thisPage})">${thisPage}</a></li>`;
    if (thisPage === lastPage) break;
  }
  if (lastPage > GROUP_SIZE) {
    result += `<li class="page-item ${
      currentPage === lastPage ? 'disabled' : ''
    }">
      <a class="page-link" href="#" onclick="moveToPage(event,${
        currentPage + 1
      })">&gt;</a>
    </li>${
      currentGroup === lastGroup
        ? ''
        : `<li class="page-item"><a class="page-link" href="#" onclick="moveToPage(event,${lastPage})">&gt;&gt;</a></li>`
    }`;
  }
  pagination.innerHTML = result;
}

async function moveToPage(e, page) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentPage = page;
  await fetchNews();
}

function markKeyword(txt) {
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

function resetMenu() {
  const currentMenu = url.searchParams.get('category');
  document.querySelectorAll('[data-category]').forEach((el) => {
    el.classList.remove('active');
    if (el.dataset.category === currentMenu) {
      el.classList.add('active');
    }
  });
}

function toggleSearchForm() {
  if (searchForm.matches('.active')) {
    searchForm.classList.remove('active');
  } else {
    searchForm.classList.add('active');
  }
}
