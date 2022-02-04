import axios from 'axios';
import {createContext, useState, useEffect} from 'react'
export const PokedexContext = createContext({
    pokedex_data: {} // Initial value
});

export const PokedexContextProvider = props => {
    const [pokedex_data, setPokedexData] = useState({});

    async function getData(name) {
        if (name) {
            const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            return result
        } else {
            try {
                const result = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=10000&offset=0")
                return result
              } catch (error) {
                console.error(error);
              } 
        }
   
      }

    useEffect(() => {
        const fetchPokedexData = async () => {
            const data = await getData();

            if (data) {
                setPokedexData(data);
            } else {
                console.log('error')
                // There was an error fetching the data
            }
        };

        fetchPokedexData();
    }, []);

    const fetchPokemon = async (name) => {
        const data = await getData(name);
        return data;
    }

    return (
        <PokedexContext.Provider
            value={{
                ...pokedex_data,
                fetchPokemon
            }}
        >
            {props.children}
        </PokedexContext.Provider>
    );
};