import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import styles from './App.module.css';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isSuccess, isFetching } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data, isSuccess]);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      {isFetching && <Loader />}

      {isError && <ErrorMessage />}

      {isSuccess && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {isSuccess && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster />
    </div>
  );
};

export default App;
