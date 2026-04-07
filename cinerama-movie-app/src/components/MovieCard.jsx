import React from 'react'



// Props:

  // - movie: the movie object from TMDB
 
  // - onClick: optional function to call when the card is clicked (navigate to details)
  
  // NOTE: This component remains presentational but supports click behavior. (Presentational component to display individual movie details in a card format. Dosen't handle any logic, just displays data passed to it via props.)



const MovieCard = ({ movie: { title, vote_average, poster_path, release_date, original_language }, onClick }) =>
{
  return (
    
    <div className='movie-card cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl' onClick={onClick}>

        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : './no-movie.png'} alt={title} onError={(e) => (e.target.src = "/no-movie.png")} />
        

            
        <div className="mt-4">

            <h3> {title} </h3>  

        </div>


        <div className="content">
            
            <div className="rating">

                <img src="./star.svg" alt="Star Icon" />

                <span> {vote_average ? vote_average.toFixed(1) : 'N/A'} </span>

            </div>
            

            <span> • </span>
        
            <span className="lang"> {original_language} </span>

            <span> • </span>
        
            <p className="year"> {release_date ? release_date.split('-')[0] : 'N/A'} </p>

        </div>

    </div>
      
  )
}






//------------------------------------------------------------------------------------------------------------






// Props:

  // - movie: the movie object from TMDB
 
  // - onClick: optional function to call when the card is clicked (navigate to details)
 
  // NOTE: This component remains presentational but supports click behavior.
  


// const MovieCard = ({ movie: { title, vote_average, poster_path, release_date, original_language }, onClick }) =>
// {
//   return (

//     <div
//       role={onClick ? "button" : undefined}
//       onClick={onClick}
//       onKeyDown={(e) => {
//         if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
//       }}
//       tabIndex={onClick ? 0 : -1}
//       className={`movie-card cursor-pointer transform transition-all duration-200
//         hover:-translate-y-1 hover:shadow-xl`}
//     >
//       <img
//         src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png"}
//         alt={title}
//         className="rounded-lg w-full h-[320px] object-cover"
//       />

//       <div className="mt-4">
//         <h3 className="text-white font-bold text-base line-clamp-1">{title}</h3>
//       </div>

//       <div className="content">
//         <div className="rating">
//           <img src="./star.svg" alt="Star Icon" className="w-4 h-4" />
//           <span>{vote_average ? vote_average.toFixed(1) : "N/A"}</span>
//         </div>

//         <span> • </span>
//         <span className="lang capitalize">{original_language}</span>
//         <span> • </span>
//         <p className="year">{release_date ? release_date.split("-")[0] : "N/A"}</p>
//       </div>
//     </div>
//   );
// };



export default MovieCard