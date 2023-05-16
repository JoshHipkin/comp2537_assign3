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
        <div class="pokeCard card">
        <h3>${thisPokemon.name}</h3>
        <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}">
        <button type="button" class="btn btn-primary">More</button>
        </div>
        `);
    }
}

$(document).ready(setup)