const PAGE_SIZE = 10;
let currentPage = 1;
let pokemons = [];
const numPageBtn = 5;

const updatePaginationDiv = (currentPage, numPages) => {
  $('#pagination').empty();
  var startI = Math.max(1, currentPage - Math.floor(numPageBtn / 2));
  var endI = Math.min(numPages, currentPage + Math.floor(numPageBtn / 2));
  if (currentPage > 1) {
    $('#pagination').append(`
      <button class="btn btn-primary page ml-1 numberedButtons" value="${currentPage - 1}">Prev</button>
    `);
  }
  for (let i = startI; i <= endI; i++) {
    var active = '';
    if (i == currentPage) {
      active = 'active';
    }
    $('#pagination').append(`
      <button class="btn btn-outline-primary page ml-1 numberedButtons ${active}" value="${i}">${i}</button>
    `);
  }
  if (currentPage < numPages) {
    $('#pagination').append(`
      <button class="btn btn-primary page ml-1 numberedButtons" value="${currentPage + 1}">Next</button>
    `);
  }
};

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  const selected_pokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  $('#pokeCards').empty();
  selected_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url);
    $('#pokeCards').append(`
      <div class="pokeCard card" pokeName="${res.data.name}">
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}" />
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">
          More
        </button>
      </div>
    `);
  });
};

const setup = async () => {
  $('#filter').empty();
  let resTypes = await axios.get('https://pokeapi.co/api/v2/type');
  let types = resTypes.data.results;
  const filterTypes = types.map((pokemonType) => pokemonType.name);
  filterTypes.forEach((type) => {
    $('#filter').append(`
      <input type="checkbox" name="type" class="form-check-input" id="${type} typeCheck" value="${type}">
      <label for="${type}" class="form-check-label">${type}</label>
    `);
  });

  const pokeTypes = async (pokemonName) => {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    return res.data.types.map((type) => type.type.name);
  };

  $('body').on('change', '#filter input[name="type"]', async function (e) {
    const $selectedTypes = $('input[name="type"]:checked');
    const selectedTypes = $selectedTypes.map(function () {
      return this.value;
    }).get();

    if (selectedTypes.length > 0) {
      let filteredTypes = await Promise.all(pokemons.map(async (pokemon) => {
        const pokemonTypes = await pokeTypes(pokemon.name);
        return selectedTypes.every((type) => pokemonTypes.includes(type)) ? pokemon : null;
      }));
      pokemons = filteredTypes.filter((p) => p !== null);
    } else {
        let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
        pokemons = response.data.results;
      }
  
      currentPage = 1;
      paginate(currentPage, PAGE_SIZE, pokemons);
      let numPages = Math.ceil(pokemons.length / PAGE_SIZE);
      updatePaginationDiv(currentPage, numPages);
    });
  
    $('#pokeCards').empty();
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    pokemons = response.data.results;
  
    paginate(currentPage, PAGE_SIZE, pokemons);
    const numPages = Math.ceil(pokemons.length / PAGE_SIZE);
    updatePaginationDiv(currentPage, numPages);
  
    // Pop up modal when clicking on a pokemon card
    $('body').on('click', '.pokeCard', async function (e) {
      const pokemonName = $(this).attr('pokeName');
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const types = res.data.types.map((type) => type.type.name);
      $('.modal-body').html(`
        <div style="width:200px">
          <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}" />
          <div>
            <h3>Abilities</h3>
            <ul>
              ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3>Stats</h3>
            <ul>
              ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
            </ul>
          </div>
        </div>
        <h3>Types</h3>
        <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
        </ul>
      `);
      $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
      `);
    });
  
    // Add event listener to pagination buttons
    $('body').on('click', '.numberedButtons', async function (e) {
      currentPage = Number(e.target.value);
      paginate(currentPage, PAGE_SIZE, pokemons);
  
      // Update pagination buttons
      updatePaginationDiv(currentPage, numPages);
    });
  };
  
  $(document).ready(setup);
  