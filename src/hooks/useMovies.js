import { useRef, useState, useMemo } from "react";
import { searchMovies } from "../services/movies.js";

export function useMovies({ search, sort }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousSearch = useRef(search);

  //
  const getMovies = useMemo(() => {
    return async ({ search }) => {
      // Evitar buscar la misma palabra con useRef
      if (previousSearch.current === search) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        previousSearch.current = search;
        const newMovies = await searchMovies({ search });
        setMovies(newMovies);
      } catch (e) {
        setError(e.message);
      } finally {
        // tanto en el try como en el catch se ejecuta el finally
        setLoading(false);
      }
    };
  }, []); //Sin dependencias crea la función solo una vez (inyectamos search como parametro a la función memoizada)

  // No ejecutes el cálculo de sortedMovies a no ser que cambien sort o movies
  const sortedMovies = useMemo(() => {
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies; // Localecompare es millor per accents i demés
  }, [sort, movies]);

  return { movies: sortedMovies, getMovies, loading };
}
