var pokemon = [];

const numPerPage = 10;
var numPages = 0;
const numPageBtn = 5;


const setup = async () => {


    let response = await axios.get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");
    const pokemon = response.data.results;
    $('#pokeCards').empty();
    for (let i = 0; i < pokemon.length; i++) {
    let innerResponse = await axios.get(`${pokemon[i].url}`);
    let thisPokemon = innerResponse.data;
    console.log(thisPokemon.sprites.front_default);
        $('#pokeCards').append(`
        <div class="pokeCard card" pokeName=${thisPokemon.name}>
        <h3>${thisPokemon.name}</h3>
        <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">More</button>
        </div>
        `);
    }


    $('body').on('click', '.pokeCard', async function (e) {
        console.log(this);
        const pokemonName = $(this).attr('pokeName');
        console.log("pokemon name: ", pokemonName);
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const types = res.data.types.map((type) => type.type.name)
        console.log("types: ", types);
        $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}">
        <div>
        <h3>abilities</h3>
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

        <div>
        <h3>Types</h3>
        <ul>
        ${types.map((type) => `<li>${type}</li>`).join('')}
        </ul>
        `);
        $('modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
    })
}


    

$(document).ready(setup)