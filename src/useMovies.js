import { useEffect,useState } from "react";
const API_KEY = "27d20e81";
export function useMovies(query,){
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
    useEffect(
    function () {
      
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("oh shit something has gone wrong");
          }
          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setError("");
          setIsLoading(false);
        } catch (err) {
          if (error.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
        if (!query.length) {
          setMovies([]);
          setError("");
          return;
        }
      }
      //handleCloseMovie();
      fetchMovies();
      return () => {
        controller.abort();
      };
    },
    [query]
  );
return {movies,isLoading,error};
}