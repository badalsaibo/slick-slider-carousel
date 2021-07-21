const URL = `https://id.hubculture.com/ultraexchange/assets?category=art`;

let IS_FULLSCREEN = false;

const slickOptions = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 2000,
    fade: true,
    centerMode: true,
    centerPadding: 0,
    cssEase: "linear",
    autoplay: false,
    autoplaySpeed: 1000,
    pauseOnFocus: false,
    pauseOnHover: false,
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
    const container = document.querySelector(".media-slideshow__content");
    data.forEach(({ id, description: alt, background_image: { content_type, src } }) => {
        const htmlEl = content_type === "video/mp4" ? createVideoEl(id, src) : createImageEl(id, src, alt);
        container.insertAdjacentHTML("beforeend", htmlEl);
    });
}

function initSlickSlider() {
    $(document).ready(function () {
        $(".media-slideshow__content").slick(slickOptions);
    });
}

fetch(URL)
    .then((res) => res.json())
    .then((data) => dataHandler(data))
    .then(() => initSlickSlider())
    .catch((error) => console.error(error));

// MEDIA SETTINGS

function setAutoplay(value) {
    $(".media-slideshow__content").slick("slickSetOption", "autoplay", value, true);
}

function setAutoplayDuration(value) {
    $(".media-slideshow__content").slick("slickSetOption", "autoplaySpeed", value);
}

function toggleAutoplayDuration(value) {
    value ? $(".media-settings__autoplay-duration").show() : $(".media-settings__autoplay-duration").hide();
}

$("#autoplay-toggle").change(function () {
    if (this.checked) {
        setAutoplay(true);
        toggleAutoplayDuration(true);
    } else {
        setAutoplay(false);
        toggleAutoplayDuration(false);
    }
});

$("#autoplay-duration").change(function () {
    setAutoplayDuration(this.value * 1000);
});

// FULL SCREEN
function toggleFullScreen() {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
    const cancelFullScreen =
        doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
    ) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}

function toggleSlickSliderControls(value = false) {
    $(".media-slideshow__content").slick("slickSetOption", "arrows", value, true);
}

function toggleMediaSettings(value = false) {
    value ? $(".media-settings").fadeIn() : $(".media-settings").fadeOut();
}

function toggleButtonSettings(value = false) {
    value ? $(".full-screen-button ").fadeIn() : $(".full-screen-button ").fadeOut();
}

$("#fullScreenButton").click(function () {
    toggleFullScreen();
    toggleSlickSliderControls(false);
    toggleMediaSettings(false);
    toggleButtonSettings(false);
});

document.addEventListener("fullscreenchange", (event) => {
    IS_FULLSCREEN = document.fullscreenElement ? true : false;
    if (!document.fullscreenElement) {
        // console.log(`Element exiting from full-screen mode.`);
        toggleSlickSliderControls(true);
        toggleMediaSettings(true);
        toggleButtonSettings(true);
    }
});

// AUTO PLAY DURATION HIDE
$(".media-settings__autoplay-duration").hide();

// IDLE TIME
function onInactive(ms, cb) {
    let wait = setTimeout(cb, ms);

    function handleMoveness() {
        if (!IS_FULLSCREEN) {
            toggleAllControls(true);
        }
        clearTimeout(wait);
        wait = setTimeout(cb, ms);
    }

    document.body.addEventListener("mousemove", handleMoveness);
    document.body.addEventListener("keydown", handleMoveness);
    document.body.addEventListener("keyup", handleMoveness);
    document.body.addEventListener("focus", handleMoveness);
}

function toggleAllControls(value) {
    toggleSlickSliderControls(value);
    toggleMediaSettings(value);
    toggleButtonSettings(value);
}

onInactive(2000, function () {
    toggleAllControls(false);
});
