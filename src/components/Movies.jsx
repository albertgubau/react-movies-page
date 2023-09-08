import React from "react";

const ListOfMovies = ({ movies }) => {
  return (
    <ul className="movies">
      {movies.map((movie) => (
        <li className="movie" key={movie.id}>
          <h3>{movie.title}</h3>
          <p>{movie.year}</p>
          <img src={movie.poster} alt={`Poster of the ${movie.title} movie`} />
        </li>
      ))}
    </ul>
  );
};

const NoMovies = () => {
  return <p>There are no movies for this search</p>;
};

export function Movies({ movies }) {
  const hasMovies = movies?.length > 0;
  return hasMovies ? <ListOfMovies movies={movies} /> : <NoMovies />;
}
