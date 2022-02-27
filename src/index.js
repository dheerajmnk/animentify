// Load CSS
require('./styles.css');

// DOM Queries
const searchField = document.querySelector('.search-field');
const animeSearch = document.querySelector('.anime-search');
const information = document.querySelector('.information');

// Load anime from API
async function loadAnime(searchTerm){
    const URL = `https://api.jikan.moe/v4/anime?q=${searchTerm}`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    displayAnimeList(data.data);
}

// Filter out search list according to user's query
function findAnime(){
    let searchTerm = searchField.value.trim();
    if(searchTerm.length > 0){
        animeSearch.classList.remove('hide-anime-search');
        loadAnime(searchTerm);
    }
    else{
        animeSearch.classList.add('hide-anime-search');
    }
}

// Trigger function whenever user enters a key into the searchbox
searchField.addEventListener('keyup', findAnime);
// Trigger function whenever user clicks on non-empty searchbox
searchField.addEventListener('click', findAnime);

// Display results in the searchbox
function displayAnimeList(anime){
    animeSearch.innerHTML = "";
    for(let idx = 0; idx < anime.length; idx++){
        let animeListItem = document.createElement('div');
        animeListItem.dataset.id = anime[idx].mal_id;
        animeListItem.classList.add('search-list');
        animePicture = anime[idx].images.jpg.image_url;

        animeListItem.innerHTML = `
        <div class = "thumbnail">
            <img src="${animePicture}" alt="Thumbnail">
        </div>
        <div class="search-info">
            <h3>${anime[idx].title}</h3>
            <p>${anime[idx].type}</h3>
        </div>
        `;
        animeSearch.appendChild(animeListItem);
    }
    loadAnimeDetails();
}

// Load all details about the search result clicked by the user
function loadAnimeDetails(){
    const animeResults = document.querySelectorAll('.search-list');
    animeResults.forEach(anime => {
        anime.addEventListener('click', async () => {
            animeSearch.classList.add('hide-anime-search');
            searchField.value = "";
            const result = await fetch (`https://api.jikan.moe/v4/anime/${anime.dataset.id}`);
            const animeDetails = await result.json();
            getGenres(animeDetails);
            displayAnimeDetails(animeDetails);
            const themeresult = await fetch (`https://api.jikan.moe/v4/anime/${anime.dataset.id}/themes`);
            const themeDetails = await themeresult.json();
            displayThemeDetails(themeDetails);
            displayTrailer(animeDetails);
        });
    })
}

// create a correctly formatted string containing all genres of the requested search query
function getGenres(details){
    str = "";
    let i = 0;
    while(i < details.data.genres.length){
        if(i != details.data.genres.length - 1){
            str+= `${details.data.genres[i].name}, `;
        }
        else{
            str+= `${details.data.genres[i].name}`;
        }
            i++;
        }
    return str;
}

// Display all anime details to the user
function displayAnimeDetails(details){
    information.innerHTML = `
            <div class = "result-grid">
                    <div class = "anime-picture">
                        <img src = "${details.data.images.jpg.image_url}" alt = "Image">
                    </div>
                    <div class="anime-info">
                        <h1 class = "title">${details.data.title}</h1>
                        <ul class = "anime-data">
                            <li class = "episodes"><span>Episodes: </span>${details.data.episodes}</li>
                            <li class = "duration">(${details.data.duration})</li>
                            <li class = "score"><span>Score: </span>${details.data.score}</li>
                            <li class = "rank"><span>Rank: </span>${details.data.rank}</li>
                            <li class = "aired"><span>Aired: </span>${details.data.aired.string}</li>
                            <li class = "studio"><span>Studio: </span>${details.data.studios[0].name}</li>
                            <li class = "genres"><span>Genres: </span>${getGenres(details)}</li>
                        </ul>
                    </div>
                    </div>
                    <div class = "anime-details">
                        <h3 class = "anime-heading">Plot</h3>
                        <p class = "plot">${details.data.synopsis}</p>
                        <h3 class = "anime-heading">Trivia</h3>
                        <p class = "trivia">${details.data.background != null ? details.data.background : "No trivia available."}</p>
                    </div>
            </div>
    `;
}

// Display all theme songs by traversing through the "openings" and "endings" arrays
function displayThemeDetails(details){
    if(details.data.openings.length != 0){
    information.innerHTML += `<h3 class = "anime-heading">Openings</h3>`;
    }
    let i = 0;
    while(i < details.data.openings.length){
        information.innerHTML += `
        <p class = "openings">${details.data.openings[i]}</p>
        `;
        i++;
    }
    
    if(details.data.endings.length != 0){
    information.innerHTML += `<h3 class = "anime-heading">Endings</h3>`;
    }
    let j = 0;
    while(j < details.data.endings.length){
        information.innerHTML += `
        <p class = "endings">${details.data.endings[j]}</p>
        `;
        j++;
    }
}

// Display a button that lets user watch the trailer if it exists for the particular result
function displayTrailer(details){
    if(details.data.trailer.url != null){
        information.innerHTML += `
        <div class = "anime-trailer">
                        <button class = "button">
                            <span>Watch the trailer!</span>
                        </button>
        </div>
        `;

        const trailer = document.querySelector('.anime-trailer'); 
        trailer.addEventListener('click', () => {
        window.open(`https://www.youtube.com/embed/${details.data.trailer.youtube_id}?enablejsapi=1&wmode=opaque&autoplay=1`, "_blank");
        });
    }
}


// Close the searchbox if user clicks outside of it
window.addEventListener('click', e => {
    if(e.target.className != 'search-field'){
        animeSearch.classList.add('hide-anime-search');
    }
});

