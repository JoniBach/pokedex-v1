import "./App.css";
import React, { useEffect, useState } from "react";
import { PokedexContext } from "./PokedexContext";

const Pokemon = ({ pokemon }) => {
  if (pokemon) {
    return (
      <div
        className="pokemon-container"
        style={{ display: "flex", marginTop: 10 }}
      >
        <img
          src={pokemon.sprites.front_default}
          style={{ width: 100, height: 100 }}
          alt={pokemon.name}
        />
        <div>
          <div className="section-title" style={{ display: "flex" }}>
            <div className="id">{pokemon?.id}:</div>
            &nbsp;
            <div className="name">{pokemon?.name}</div>
          </div>

          <div className="types">
            {pokemon?.types?.map(({ type }) => (
              <div className="type">{type.name}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

function App() {
  const { data, fetchPokemon } = React.useContext(PokedexContext);
  const [pokemon, setPokemon] = useState();
  const [loading, setLoading] = useState(false);
  const [partial, setPartial] = useState([]);

  const submitSearch = async (name) => {
    setLoading(true);
    const { data } = await fetchPokemon(name);
    setPokemon(data);
    setLoading(false);
  };

  const partialSearch = async (name) => {
    const checkList =
      name.length >= 3 &&
      (await data?.results?.filter((newData) => newData.name.includes(name)));
    checkList.length > 0 ? setPartial(checkList) : setPartial([]);
    checkList.length === 1 && submitSearch(partial[0].name);
  };

  const results = data?.results;
  const listData = () => {
    if (partial?.length > 0) {
      return partial;
    } else {
      return results;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        className="list"
        style={{
          height: "100vh",
          overflowY: "scroll",
          overflowX: "hidden",
          background: "#eee",
        }}
      >
        <input
          onChange={(e) => partialSearch(e.target.value)}
          placeholder="search"
          style={{ width: "100%", padding: 5 }}
        />
        <table>
          <tr></tr>
          <th>ID</th>
          <th>Name</th>

          {listData()?.map(({ name }, index) => (
            <tr
              className="name"
              onClick={() => submitSearch(name)}
              style={{ cursor: "pointer" }}
            >
              <td>{index + 1}</td>
              <td>{name.replace("-", " ")}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className="highlight" style={{ margin: 10, width: "100%" }}>
        {loading ? "loading" : pokemon && <Pokemon pokemon={pokemon} />}
      </div>
    </div>
  );
}

export default App;
