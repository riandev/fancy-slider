const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// API Key
const KEY = '20264558-25fdf88236194ea6190e9c997';

const getImages = (query) => {
    loadingSpinner();
    fetch(`https://pixabay.com/api/?key=${KEY}&=${query}&image_type=photo&pretty=true&orientation=horizontal&category=nature`)
        .then(response => response.json())
        // .then(data => console.log(data.hits))
        .then(data => showImages(data.hits))
        .catch(err => displayError('Sorry Unable to Load Data From Server!!!'))
}

// show images 
const showImages = (images) => {
    imagesArea.style.display = 'block';
    loadingSpinner();
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div);
    })
}

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.add('added');

    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
    } else {
        element.classList.remove('added');
        sliders.pop(img);
    }
}
var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    const duration = document.getElementById('duration').value;

    if (duration >= 1) {
        sliders.forEach(slide => {
            let item = document.createElement('div')
            item.className = "slider-item";
            item.innerHTML = `<img class="w-100"
  src="${slide}"
  alt="">`;
            sliderContainer.appendChild(item)
        })
        changeSlide(0)
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, duration);
        //Setting Default Duration Value 1 Second
    } else if (duration === '') {
        sliders.forEach(slide => {
            let item = document.createElement('div')
            item.className = "slider-item";
            item.innerHTML = `<img class="w-100"
        src="${slide}"
        alt="">`;
            sliderContainer.appendChild(item)
        })
        changeSlide(0)
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, 1000);
    }
    //Alert if Duration value 0 or Negitive Value
    else {
        alert("Please insert Positive Time Value in millisecond")
    }
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

searchBtn.addEventListener('click', function() {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
})

sliderBtn.addEventListener('click', function() {
        createSlider()
    })
    //Search Photos By Pressing Enter Key
const KeyEnter = document.getElementById('search').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('search-btn').click();
        }
    })
    //Catch Error
const displayError = (err) => {
    document.getElementById('display-error').innerText = err;
}
const loadingSpinner = () => {
    const loadingSpiner = document.getElementById('loading');
    loadingSpiner.classList.toggle('d-none')
}