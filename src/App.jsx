import "./App.css";
import { useRef, useState, useEffect, useCallback } from "react"; //Permite guardar una referencia mutable, para no volver a renderizar un compo al cambiarlo, permite que una variable persista durante todo el ciclo de vida del componente. Cuando el useRef cambia de valor no vuelve a renderizar compo. También permite guardar referencias de un elemento del DOM
import { Movies } from "./components/Movies.jsx";
import { useMovies } from "./hooks/useMovies.js";

import debounce from "just-debounce-it";

function useSearch() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }

    if (search === "") {
      setError("No se puede buscar una película vacía");
      return;
    }

    if (search.match(/^\d+$/)) {
      setError("No se puede buscar una película con un número");
      return;
    }

    if (search.length < 3) {
      setError("La búsqueda debe de tener almenos 3 carácteres");
      return;
    }

    setError(null);
  }, [search]);
  return { search, setSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);
  const { search, setSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search, sort });

  const debouncedGetMovies = useCallback(
    debounce((search) => {
      getMovies({ search });
    }, 500),
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    //Si tenemos muchos inputs podemos utilizar esto en vez de utilizar muchos useRef para cada input
    // const { query } = Object.fromEntries(new window.FormData(event.target));

    getMovies({ search });
  };

  const handleSort = () => {
    setSort(!sort);
  };

  const handleChange = (e) => {
    const newQuery = e.target.value; //Para que no detecte un estado anterior al ser asíncrono
    if (newQuery.startsWith(" ")) return;

    setSearch(newQuery);
    debouncedGetMovies(newQuery);
  };

  return (
    <>
      <div className="page">
        <header>
          <h1>Buscador de peliculas</h1>
          <form onSubmit={handleSubmit} className="form">
            <input
              style={{
                border: "1px solid transparent",
                borderColor: error ? "red" : "transparent",
              }}
              onChange={handleChange}
              value={search}
              name="search"
              placeholder="Avengers, Star Wars, Matrix..."
            />
            <input type="checkbox" onChange={handleSort} checked={sort} />
            <button type="submit">Buscar</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </header>
        <main>{loading ? <p>Loading...</p> : <Movies movies={movies} />}</main>
      </div>
    </>
  );
}

export default App;
