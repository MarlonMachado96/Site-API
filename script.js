const bodyContainer = document.getElementById('bodyContainer');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const modal = document.getElementById('modal');
const favoritesList = document.getElementById('favoritesList');
const showFavoritesBtn = document.getElementById('showFavoritesBtn');

let bodies = [];
let filteredBodies = [];
let page = 1;
const itemsPerPage = 10;

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchBodies() {
const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/');
const data = await response.json();
bodies = data.bodies;
filteredBodies = bodies;
displayBodies(filteredBodies.slice(0, itemsPerPage * page));
}

function displayBodies(bodyList) {
    bodyContainer.innerHTML = '';
    bodyList.forEach((body) => {
    const bodyCard = document.createElement('div');
    bodyCard.className = 'card';
    bodyCard.innerHTML = `
        <h3>${body.englishName}</h3>
        <div class="card-details">
            <p><strong>Tipo:</strong> ${body.bodyType}</p>
            <p><strong>Massa:</strong> ${body.mass ? body.mass.massValue + ' ' + body.mass.massExponent + ' kg' : 'Desconhecida'}</p>
            <p><strong>Gravidade:</strong> ${body.gravity ? body.gravity + ' m/s²' : 'Desconhecida'}</p>
            <p><strong>Densidade:</strong> ${body.density ? body.density + ' g/cm³' : 'Desconhecida'}</p>
            <p><strong>Raio:</strong> ${body.meanRadius ? body.meanRadius + ' km' : 'Desconhecido'}</p>
            <p><strong>Descoberto por:</strong> ${body.discoveredBy || 'Desconhecido'}</p>
            <p><strong>Data de Descoberta:</strong> ${body.discoveryDate || 'Desconhecida'}</p>
            <button class="favBtn">Favoritar</button>
        </div>
    `;
    bodyCard.addEventListener('click', () => showDetails(body));
    bodyContainer.appendChild(bodyCard);
    });
}

function showDetails(body) {
alert(`Nome: ${body.englishName}\nDescrição: Tipo de corpo celeste - ${body.bodyType}`);
}

window.addEventListener('scroll', () => {
if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
page++;
displayBodies(filteredBodies.slice(0, itemsPerPage * page));
}
});

filterSelect.addEventListener('change', (e) => {
const selectedType = e.target.value;
filteredBodies = bodies.filter(body =>
selectedType ? body.bodyType.toLowerCase() === selectedType.toLowerCase() : true
);
page = 1;
displayBodies(filteredBodies.slice(0, itemsPerPage * page));
});

searchInput.addEventListener('input', (e) => {
const query = e.target.value.toLowerCase();
filteredBodies = bodies.filter((body) => body.englishName.toLowerCase().includes(query));
displayBodies(filteredBodies.slice(0, itemsPerPage * page));
});

function toggleFavorite(body) {
const index = favorites.findIndex(fav => fav.id === body.id);
if (index === -1) {
    favorites.push(body);
} else {
    favorites.splice(index, 1);
}
localStorage.setItem('favorites', JSON.stringify(favorites));
}

function showFavorites() {
favoritesList.innerHTML = '';
favorites.forEach((body) => {
const favItem = document.createElement('div');
favItem.innerHTML = `
    <h3>${body.englishName}</h3>
    <p><strong>Tipo:</strong> ${body.bodyType}</p>
    <p><strong>Massa:</strong> ${body.mass ? body.mass.massValue + ' ' + body.mass.massExponent + ' kg' : 'Desconhecida'}</p>
    <p><strong>Gravidade:</strong> ${body.gravity ? body.gravity + ' m/s²' : 'Desconhecida'}</p>
    <p><strong>Densidade:</strong> ${body.density ? body.density + ' g/cm³' : 'Desconhecida'}</p>
    <p><strong>Raio:</strong> ${body.meanRadius ? body.meanRadius + ' km' : 'Desconhecido'}</p>
    <p><strong>Descoberto por:</strong> ${body.discoveredBy || 'Desconhecido'}</p>
    <p><strong>Data de Descoberta:</strong> ${body.discoveryDate || 'Desconhecida'}</p>
`;
favoritesList.appendChild(favItem);
});
modal.style.display = 'block';
}

document.querySelector('.close').onclick = function() {
modal.style.display = 'none';
}

document.addEventListener('click', (e) => {
if (e.target.classList.contains('favBtn')) {
const bodyName = e.target.parentElement.parentElement.querySelector('h3').textContent;
const body = bodies.find(b => b.englishName === bodyName);
toggleFavorite(body);
}
});

showFavoritesBtn.addEventListener('click', showFavorites);

fetchBodies();
