import type { Movie } from '../../types/movie';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const MovieGrid = ({ movies, onSelect }: MovieGridProps) => {
  return (
    <ul className={styles.grid}>
      {movies.map((movie) => (
        <li
          className={styles.card}
          key={movie.id}
          onClick={() => onSelect(movie)}
        >
          <img
            className={styles.image}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <h2 className={styles.title}>{movie.title}</h2>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;
