const URL = `https://id.hubculture.com/ultraexchange/assets?category=art`;

const slickOptions = {
  dots: true,
  infinite: true,
  speed: 700,
  centerMode: true,
  centerPadding: 0,
  easing: 'swing',
  autoplay: true,
  nextArrow:
    '<span class="media-control--next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg></span>',
  prevArrow:
    '<span class="media-control--prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/></svg></span>',
};

function createImageEl(id, src, alt) {
  return `<img src="${src}" alt="${alt}" id="${id}" class="media-content" />`;
}

function createVideoEl(id, src) {
  return `<video class="media-content" autoplay muted loop id="${id}">
            <source src="${src}" type="video/mp4" />
          </video>`;
}

function dataHandler(apiData) {
  const { data } = apiData;
  const container = document.querySelector('.media-slideshow__content');
  data.forEach(({ id, description: alt, background_image: { content_type, src } }) => {
    const htmlEl =
      content_type === 'video/mp4' ? createVideoEl(id, src) : createImageEl(id, src, alt);
    container.insertAdjacentHTML('beforeend', htmlEl);
  });
}

function initSlickSlider() {
  $(document).ready(function () {
    $('.media-slideshow__content').slick(slickOptions);
  });
}

fetch(URL)
  .then((res) => res.json())
  .then((data) => dataHandler(data))
  .then(() => initSlickSlider())
  .catch((error) => console.error(error));
