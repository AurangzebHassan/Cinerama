// Main application component for a Vite + React project. This is where the main UI of the app will be rendered.





  // import { useState, useEffect, use } from 'react'

  // import './App.css'



  // const Card = ({ title }) =>
  // {
  //   const [hasLiked, setHasLiked] = useState(false);

  //   const [count, setCount] = useState(0);


  //   useEffect(
    
  //     () =>
  //     {
  //       console.log(`${title} has ${hasLiked ? '' : 'not '}been liked!`);
  //     },
      
  //     [hasLiked]    // Dependency array to control when the effect runs (only when hasLiked changes).

  //   );


  //   // useEffect(
    
  //   //   () =>
  //   //   {
  //   //     console.log('Card Rendered!');
  //   //   },
      
  //   //   []    // Dependency array to control when the effect runs (runs only once when that component first appears).

  //   // );


  //   return (
      
  //     <div className="card" onClick={() => setCount(count + 1)}>
        
  //       <h2> {title} <br /> {count || null} </h2>

  //       <button onClick={() => setHasLiked(!hasLiked)}> {hasLiked ? 'Liked' : 'Like'} </button>
      
  //     </div>
    
  //   );
  // }



  // function App()
  // {
  //   return (

  //     // React fragment to group multiple elements without adding extra nodes to the DOM

  //     // React's rendering process needs state and props to decide when and where to re-render the components.

  //     <div className="card-container">

  //       <Card title="Avatar" rating={5} isCool={true} />

  //       <Card title="The Dark Knight" />

  //       <Card title="The Lorax" />

  //     </div>

  //   );
  // }



  // export default App






//--------------------------------------------------------------------------------------------------------------------------






// User logs in → App checks session via getCurrentUser().

// On typing in search → searchTerm updates.

// useDebounce() waits 500ms → updates debouncedSearchTerm.

// useEffect() triggers fetchMovies(debouncedSearchTerm).

// TMDB API fetches movie results.

// updateSearchCount() sends data to Appwrite DB.

// getTrendingMovies() fetches trending data for the logged-in user.

// UI re-renders showing:

    // Trending searches.

    // Search results.

    // Logout option.

    // Background + Hero section.



import React from 'react'

import { useState, useEffect } from 'react'

import { useDebounce } from 'react-use'     // adds a delay so the API isn’t called on every keystroke.

import Search from '../components/Search'

import Spinner from '../components/Spinner'

import MovieCard from '../components/MovieCard';

import { updateSearchCount, getTrendingMovies, logout, getCurrentUser } from '../appwrite'

import { useNavigate } from 'react-router-dom'



// TMDB MOVIE DATABASE SETUP:

    const API_BASE_URL = 'https://api.themoviedb.org/3';

    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


    // console.log('API Key:', API_KEY);   // Log the API key to verify it's being loaded correctly.
    

    // So anytime you call fetch(endpoint, API_OPTIONS), the API knows you’re an authorized developer.

        const API_OPTIONS =     // setus up the HTTP request headers
        {
            method: 'GET',

            headers:
            {
                accept: 'application/json',   // API will send back a JSON object/response. Accepts JSON
            
                Authorization: `Bearer ${API_KEY}`  // Authenticates each request with your TMDB bearer token.
            }
        }



const MoviePage = () =>
{

  const [searchTerm, setSearchTerm] = useState('');     // What user is typing in the search bar.

  const [errorMessage, setErrorMessage] = useState('');     // Any API or logic errors to show in UI.

  const [movieList, setMovieList] = useState([]);   // The movies fetched from TMDB.

  const [isLoading, setIsLoading] = useState(false);  // Whether data is currently being fetched. Set isLoading to true initially to show the loading state when the component first mounts.


  const [trendingMovies, setTrendingMovies] = useState([]);   // Top searched movies for the logged-in user (from Appwrite).


  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');   // A delayed version of searchTerm used to reduce API calls.
  
    
// debounce the search term input to avoid making API calls on every keystroke. This improves performance and reduces unnecessary API requests.

// What’s happening in my code

  // searchTerm updates immediately as the user types.

  // The useDebounce() hook waits 500ms after the user stops typing.

  // Then it sets debouncedSearchTerm.

  // Your useEffect() watches that debouncedSearchTerm and calls fetchMovies() only then.

  // The result: fewer API calls, faster UI, smoother typing.

    useDebounce(
      () =>
      {
        setDebouncedSearchTerm(searchTerm);
      },

      500,   // Delay in milliseconds

      [searchTerm]   // Only re-run the debounce if searchTerm changes
    );



// Fetch the current user info when the component mounts. State to hold the current user info.

    const [user, setUser] = useState(null);   // Logged-in user info (fetched from Appwrite).


    const navigate = useNavigate();


    
// fetchMovies to search movies based on popularity. uses the discover/movie endpoint of TMDB API.

  // const fetchMovies = async () =>
  // {
  //   setIsLoading(true);

  //   setErrorMessage('');


  //   try
  //   {
  //     const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

  //     const response = await fetch(endpoint, API_OPTIONS);    // fetch() is a built-in javascipt function/browser API to make HTTP requests.


  //     if (!response.ok)
  //     {
  //       throw new Error('Network response was not ok');
  //     }


  //     const data = await response.json();

  //     console.log(data);


  //     if (data.Response === "False")
  //     {
  //       setErrorMessage(data.Error || 'Failed to fetch movies.');

  //       setMovieList([]);

  //       return;
  //     }

  //     setMovieList(data.results || []);
  //   }

  //   catch (error)
  //   {
  //     console.error(`Error fetching movies: ${error}`);

  //     setErrorMessage('Error fetching movies. Please try again later.');    // Displays the error in the browser/UI.
  //   }

  //   finally
  //   {
  //     setIsLoading(false);
  //   }
  // }



// fetchMovies to search movies based on the search term entered by the user. Uses the search/movie endpoint of TMDB API. Takes a string query parameter.
  
   const fetchMovies = async (query = '') =>
  {
    // Sets up a loading state and clears previous errors.
       
        setIsLoading(true);

        setErrorMessage('');


    try
    {
        // If query is non-empty, use the /search/movie API, else use the /discover/movie API for popular movies.

        // encodeURIComponent() to encode special characters in the search term. Even if the user enters spaces or special characters, the API request will still be valid. Ensures spaces/symbols don’t break the URL.

            const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

        
        // fetch() sends the HTTP request.
        
            const response = await fetch(endpoint, API_OPTIONS);    // fetch() is a built-in javascipt function/browser API to make HTTP requests.


        // Checks for successful response and parses it into a JavaScript object.
        
            if (!response.ok)
            {
                throw new Error('Network response was not ok');
            }


            const data = await response.json();

        console.log(data);


        if (data.Response === "False")
        {
            setErrorMessage(data.Error || 'Failed to fetch movies.');

            setMovieList([]);

            return;
        }

        setMovieList(data.results || []);


        // // Only update the search count if there's a valid search term and results are found.

            if (query && data.results && data.results.length > 0)
            {
                // update per-user metrics (appwrite will use getCurrentUser internally)

                // calls updateSearchCount() which updates appwrite DB

                    await updateSearchCount(query, data.results[0]);   // Increment the search count in Appwrite database whenever a search is made.  
                
            
                // refresh trending after updating per-user metrics
            
                    const userAfter = await getCurrentUser();
                
                    if (userAfter) 
                    {
                        const movies = await getTrendingMovies(userAfter.$id);
                        
                        setTrendingMovies(movies);
                    }
            }
    }

    catch (error)
    {
      console.error(`Error fetching movies: ${error}`);

      setErrorMessage('Error fetching movies. Please try again later.');    // Displays the error in the browser/UI.
    }

    finally
    {
      setIsLoading(false);
    }
   }
  


//   const loadTrendingMovies = async () =>
//   {
//     try
//     {
//       const movies = await getTrendingMovies();   // Fetch the trending movies from Appwrite database.

//       setTrendingMovies(movies);   // Update the state with the fetched trending movies.
//     }

//     catch (error)
//     {
//       console.error(`Error fetching trending movies: ${error}`);
//     }
//   }


 
// Called fetchMovies at the initial render of the component to load popular movies. Didn't want to call it on every render, so used an empty dependency array. Didn't deal with searches.

  // useEffect(
  //   () =>
  //   {
  //     fetchMovies();
  //   },

  //   []
  // )



// Calls fetchMovies whenever the searchTerm changes. This way, we fetch new movie data based on the user's search input. Called it initially too, since searchTerm is initially an empty string.

  // useEffect(
  //   () =>
  //   {
  //     fetchMovies(searchTerm);
  //   },

  //   [searchTerm]   // Only call fetchMovies when searchTerm changes.
  // )



// Calls fetchMovies whenever the debouncedSearchTerm changes. This way, we fetch new movie data based on the user's search input, but only after the user has stopped typing for 500ms.

  useEffect(
    () =>
    {
      fetchMovies(debouncedSearchTerm);

      // we won't be calling loadTrendingMovies() here, because that would require API calls every single time we search, so we want to load the trending movies only once when the component first mounts. So, we'll call it in a separate useEffect with an empty dependency array.
    },

    [debouncedSearchTerm]   // Only call fetchMovies when debouncedSearchTerm changes(when the user stops typing for 300ms).
  )

    




// Fetch the current user info when the component mounts. Fetch logged in user.

// Set up a flag to track if the component is still mounted to avoid setting state on an unmounted component.

// This is important because getCurrentUser() is asynchronous, and the component might unmount before the promise resolves.
    
    useEffect(() => {
        
        let mounted = true;
        
        getCurrentUser().then((u) =>
        {
            if (mounted) setUser(u);
        })
    
        .catch((error) => { console.error(`Error getting the current user info: ${error}`); })
    
        .finally(() => { });
        
        return () => (mounted = false);
    
    }, []);

    
    
    
    
    
// PREVIOUS STATEMENT: ------------------->     //   useEffect(
                                                //     () =>
                                                //     {
                                                //       loadTrendingMovies();   // we want to load the trending movies only once when the component first mounts. So, we'll call it in a separate useEffect with an empty dependency array.
                                                //     },
                                                //
                                                //     []   // Empty dependency array means this effect runs only once when the component first mounts.
                                                //   )

// when user is loaded, fetch user-specific trending movies list.

    useEffect(() =>
    {
        if (!user) return;

  
        const loadTrending = async () =>
        {
            try
            {
                // ensure Appwrite session is valid
      
                    // await account.get();

                
                const movies = await getTrendingMovies(user.$id);
      
                setTrendingMovies(movies);
            } 
            
            catch (err) 
            {
                console.error("Error loading trending movies:", err);
            }
        };

        loadTrending();
        
    }, [user]);     // Only re-run this effect when the user state changes (i.e., when the user info is fetched).
  
    
    



    
    
    
//   return (

//     <main>

//       <div className="patern" />

//         <div className='wrapper'>

//           <header>

//             <img src='./hero.png' alt='Hero Banner' />
          
//             <h1>Find <span className='text-gradient'> Movies </span> You'll Enjoy Without The Hassle</h1>
          
//             <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />   {/* setSearchTerm() would have called it immediately on render. Just pass the function declaration.*/}

//           </header>


        
//           {trendingMovies.length > 0 && (   // Only show the trending section if there are trending movies available.

//             <section className='trending'>

//               <h2 > Trending Movies </h2>

//               <ul>

//                 {trendingMovies.map((movie, index) => ( <li key={movie.$id}> <p> {index + 1} </p> <img src={movie.poster_url} alt={movie.title} /> </li> ))}   {/* Use movie.$id as the key since it's unique in Appwrite database. */}

//               </ul>

//             </section>

//           )}



//          <section className='all-movies'>

//               <h2 > All Movies </h2>
          

//             {
//               isLoading ? (<Spinner />)    // If loading, show the spinner.
              
//               : errorMessage ? ( <p className="text-red-500"> {errorMessage} </p>)
                
//                 : (
                    
//                     // neither loading nor showing the error message, so show the movie list
                  
//                     <ul>

//                       {movieList.map((movie) => (<MovieCard key={movie.id} movie={movie} />))}

//                     </ul>
//                   )  
//             }

//           </section>

//         </div>

//     </main>
//   )
    
    
    
    // const handleLogout = async () =>
    // {
    //     await logout();
    
    //     window.location.href = "/login";
    // };

//     return (
//     <main>
//       <div className="pattern" />
//       <div className="wrapper">
//         <header>
//           <div className="flex justify-between items-center mb-4">
//             <img src="/hero.png" alt="Hero Banner" className="max-w-lg mx-auto" />
//             {user && (
//               <div className="flex flex-col items-end text-white">
//                 <p className="text-sm mb-1">Welcome, {user.name || user.email}</p>
//                 <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded">
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>

//           <h1>
//             Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle
//           </h1>
//           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         </header>

//         {trendingMovies.length > 0 && (
//           <section className="trending mt-10">
//             <h2>Trending Movies (Your searches)</h2>
//             <ul>
//               {trendingMovies.map((movie, index) => (
//                 <li key={movie.$id}>
//                   <p>{index + 1}</p>
//                   <img src={movie.poster_url} alt={movie.searchTerm} />
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}

//         <section className="all-movies mt-10">
//           <h2>All Movies</h2>
//           {isLoading ? (
//             <Spinner />
//           ) : errorMessage ? (
//             <p className="text-red-500">{errorMessage}</p>
//           ) : (
//             <ul>
//               {movieList.map((movie) => (
//                 <MovieCard key={movie.id} movie={movie} />
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </main>
//   );

    
    // Logout handler
  



  
  
// Logs the user out (via Appwrite) and redirects to login.

    const handleLogout = async () =>
    {
        await logout();
    
        window.location.href = '/login';
    };



    return (
        
        <main>
        
            <div className="pattern" />     {/* .pattern = background image (see Tailwind setup). */}
        
        <div className="wrapper">
            
            {/* <header>
            
            <div className="flex justify-between items-center mb-6">
                
                <img
                
                src="/hero.png"
                a
                lt="Hero Banner"
                
                className="max-w-lg mx-auto sm:mx-0 sm:max-w-md drop-shadow-md"
                
                />

                
                {user && (
                
                <div className="flex flex-col items-end sm:items-end text-white sm:mr-4 mt-4 sm:mt-0">
                    
                    <p className="text-sm text-light-200 mb-1">
                    
                    Welcome, {user.name || user.email}
                    
                    </p>
                    
                    <button
                    
                    onClick={handleLogout}
                    
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition duration-200 shadow-sm"
                    
                    >
                    
                    Logout
                    
                    </button>
                
                </div>
                
                )}
            
            </div> */}
                
                
            <header className="relative flex flex-col items-center text-center sm:mt-10 mt-6">
  
                    
            {/* User Info + Logout (Top Right) */}
  
                {user && (
        
                    <div className="absolute top-4 right-0 flex items-end text-white justify-center">
        
                    <span className="text-2xl text-light-400 font-extrabold mr-3">
            
                        {user.name}
        
                    </span>

                    <span><button
            
                        onClick={handleLogout}
            
                        className="bg-red-500 hover:bg-red-900 focus:bg-red-900 font-medium text-white mt-3 text-xl sm:text-sm w-20 h-8 px-3 py-1 rounded-md transition duration-200 shadow-md"
        
                    >
            
                        Logout
        
                    </button></span>
        
                    </div>
    
                )}

  
            {/* Hero Image + Ttile + Search */}
  
                <img
        
                    src="/hero.png"
        
                    alt="Hero Banner"
        
                    className="w-[320px] sm:w-[480px] lg:w-[550px] h-auto object-contain drop-shadow-md mt-8"
    
                />


                
                <h1>
                    
                    Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle
                
                </h1>
                
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            </header>

            
            {/* Trending Section */}
                
                {trendingMovies.length > 0 && (         // replaced ? with && as we're going to show the trending section when there are searches existing. We dont need an if-else ternary now.
                
                <section className="trending mt-10">
                    
                    <h2>Your Trending Searches</h2>
                    
                    {/* <ul>
                    
                    {trendingMovies.map((movie, index) => (
                        
                        <li key={movie.$id}>
                        
                        <p>{index + 1}</p>
                        
                        <img src={movie.poster_url} alt={movie.searchTerm} />
                        
                        </li>

                    ))}
                    
                    </ul> */}
                        

                  
                    <ul>
                        
                        {trendingMovies.map((doc, index) => 
                        {
                            const movieId = doc.movie_id || doc.movieId;
                            
                            return (
                            
                                <li key={doc.$id} onClick={() => navigate(`/movie/${movieId}`)}>
                                
                                    <p>{index + 1}</p>
                                
                                    <img
                                    
                                        src={`https://image.tmdb.org/t/p/w500${doc.poster_url?.replace("https://image.tmdb.org/t/p/w500", "") || ""}`}
                                        
                                        alt={doc.searchTerm || "Trending Movie"}
                                        
                                        className="cursor-pointer transition-transform duration-200 hover:scale-105"
                                        
                                        onError={(e) => (e.target.src = "/no-movie.png")}
                                    />
                                    
                                </li>
                            
                            );
                        })}
                                    
                    </ul>
                
                </section>
         
                    
            // Commenting out to not show th trending movies section when there are no searches by the user.
            
                // ) 
                
                    
                    
                // : (
                    
                //     <section className="trending mt-10">
                        
                //         <h2>Your Trending Searches</h2>
                        
                //         <p className="text-gray-100 mt-3">
                        
                //         You haven’t searched anything yet. Start exploring!
                        
                //         </p>
                    
                //     </section>
                
            )}

            
            {/* All Movies Section */}
            
                <section className="all-movies mt-8">
                
                <h2>All Movies</h2>
                
                {isLoading ? (
                    
                    <Spinner />
                
                ) : errorMessage ? (
                    
                    <p className="text-red-500">{errorMessage}</p>
                
                ) : (
                                  
                    <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              
                        {movieList.map((movie) => (
                
                            // pass onClick to each movie card to navigate to details
                
                                <li key={movie.id}>
                                
                                    <MovieCard
                                    
                                        movie={movie}
                                        
                                        onClick=
                                        {
                                            () =>
                                            {
                                    
                                                navigate(`/movie/${movie.id}`);

                                                window.scrollTo({ top: 0, behavior: "smooth" });

                                            }
                                        }
                                    />

                                </li>
                        ))}
                                    
                    </ul>
                )}
                
                </section>
        
        </div>
        
        </main>

    );
}



export default MoviePage;