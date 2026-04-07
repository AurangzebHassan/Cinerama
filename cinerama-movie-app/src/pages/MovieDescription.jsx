import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Spinner from "../components/Spinner";

import MovieCard from "../components/MovieCard";



const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS =
{
    method: "GET",

    headers:
    {
      accept: "application/json",

      Authorization: `Bearer ${API_KEY}`,
    }
};



const MovieDescription = () =>
{
  const { id } = useParams();   // useParams → extracts the movie id from the URL (/movie/:id).

  const navigate = useNavigate();   // useNavigate → allows navigation (used for “Back” button and clicking recommended movies).

  const [movie, setMovie] = useState(null);  

  const [trailer, setTrailer] = useState(null);   // trailer → stores the YouTube video key (to embed trailer).

  const [recommendations, setRecommendations] = useState([]);   // recommendations → array of similar/recommended movies (shown at the bottom).

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");



  // Scroll to top whenever a new movie page opens
  
    useEffect(() => 
    {
      window.scrollTo({ top: 0, behavior: "smooth" });    // Whenever a new movie ID loads (like clicking another recommended movie), → scroll to the top smoothly.

    }, [id]);

  
  
  // Fetch movie details, trailer, and recommendations
    
    useEffect(() => 
    {
      const fetchMovieDetails = async () =>
      {
        setIsLoading(true);
      
        setErrorMessage("");

        try
        {
          // Movie details
            
            const resMovie = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
            
            if (!resMovie.ok) throw new Error("Failed to fetch movie details");
            
            const dataMovie = await resMovie.json();
            
            setMovie(dataMovie);


          
          // Trailer
          
            const resVideos = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);   // Fetches /movie/{id}/videos endpoint → returns all related videos (trailers, teasers, clips).
            
            const dataVideos = await resVideos.json();
            
            const youtubeTrailer = dataVideos.results.find(
            
                (vid) => vid.type === "Trailer" && vid.site === "YouTube"
            
              );
            
            setTrailer(youtubeTrailer ? youtubeTrailer.key : null);

          
          
          // Recommended movies

            const resRecs = await fetch(`${API_BASE_URL}/movie/${id}/recommendations`, API_OPTIONS);    // Fetches /movie/{id}/recommendations → returns related/similar movies.
            
            const dataRecs = await resRecs.json();
            
            setRecommendations(dataRecs.results || []);   // Sets array to state (used at bottom to render movie cards).
        }
        
        catch (err)
        {
          console.error("Error fetching movie details:", err);
        
          setErrorMessage("Failed to load movie details. Please try again later.");
        } 
        
        finally
        {
          setIsLoading(false);
        }
      };

      fetchMovieDetails();

    }, [id]);


  
  if (isLoading) return <Spinner />;
  

  if (errorMessage)
    
    return <p className="text-center text-red-500 mt-10">{errorMessage}</p>;
  
    
  if (!movie)
    
    return <p className="text-center text-gray-300 mt-10">Movie not found.</p>;



  return (
    
    <main className="min-h-screen bg-primary text-white px-6 sm:px-10 py-10">
    
      <div className="max-w-6xl mx-auto">
    
        
        {/* 🔙 Back Button */}
    
          <button
            
            onClick={() => navigate(-1)}		// Calls navigate(-1) → go back one page in history.
            
            className="mb-6 bg-light-100/10 hover:bg-light-100/20 text-light-200 px-4 py-2 rounded-md transition"
            
          >
            
            ← Back
            
          </button>


        
        {/* 🎥 Movie Header */}

          <div className="flex flex-col md:flex-row gap-8">
            
            <img
              
				src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
				
				alt={movie.title}
				
				className="rounded-lg w-full md:w-[300px] lg:w-[350px] shadow-lg"

				onError={(e) => (e.target.src = "/no-movie.png")}
              
            />

            <div>
              
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              
              <p className="text-light-200 text-lg mb-3 italic">
              
              {movie.tagline || ""}
              
              </p>

            
              <div className="flex flex-wrap items-center gap-3 mb-6">
            
                <span className="bg-light-100/10 px-3 py-1 rounded-full text-sm cursor-pointer">
            
                  ⭐ {movie.vote_average?.toFixed(1)}
            
                </span>
            
                <span className="bg-light-100/10 px-3 py-1 rounded-full text-sm cursor-pointer">
            
                  {movie.runtime} min
            
                </span>
            
                <span className="bg-light-100/10 px-3 py-1 rounded-full text-sm cursor-pointer">
            
                  {movie.release_date?.split("-")[0]}
            
                </span>
            
            </div>

            
              <p className="text-gray-300 mb-5 leading-relaxed">
            
                {movie.overview || "No description available."}
            
              </p>

            
              {movie.genres?.length > 0 && (
            
              <p className="mb-4">
              
                <strong>Genres: </strong>
              
                {movie.genres.map((g) => g.name).join(", ")}
              
              </p>
              
            )}

              {movie.homepage && (
            
              <a
              
                href={movie.homepage}
                
                target="_blank"
                
                rel="noopener noreferrer"
                
                className="text-indigo-400 hover:underline"
                
              >
              
                Official Website ↗
              
              </a>
              
            )}
            
          </div>
          
        </div>


        
        {/* 🎞️ YouTube Trailer */}
         
        {trailer && (
            
          <div className="mt-10">
          
            <h2 className="flex text-2xl font-semibold mb-4">Watch Trailer</h2>
          
            <div className="flex aspect-video rounded-lg overflow-hidden shadow-md justify-end">
          
              <iframe
          
                width="100%"
                
                height="650"
                
                src={`https://www.youtube.com/embed/${trailer}`}
                
                title="YouTube trailer"
                
                // frameBorder="0"
                
                allowFullScreen
                
              ></iframe>
              
            </div>
            
          </div>
          
        )}

        

        {/* 🎬 Recommended Movies */}
        
        
        {recommendations.length > 0 && (
        
          <section className="mt-12">
          
            <h2 className="text-2xl font-semibold mb-5">Recommended Movies</h2>
          
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          
              {recommendations.map((rec) => (
          
                <li key={rec.id}>
                
                  <div
                
                    onClick={() => navigate(`/movie/${rec.id}`)}
                    
                    className="cursor-pointer transition-transform duration-200 hover:scale-105"
                  >
                    
                    
                    <MovieCard movie={rec} />
                  
                  </div>
                
                </li>
              
              ))}
            
            </ul>
          
          </section>
        
        )}
      
      </div>
    
    </main>
  
  );
};



export default MovieDescription;