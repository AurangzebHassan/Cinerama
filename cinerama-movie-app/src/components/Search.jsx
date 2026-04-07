import React from 'react'



const Search = ({ searchTerm, setSearchTerm }) =>
{
  return (

      <div className='search'>
          
          <div>
              
            <img src="./search.svg" alt="Search Logo" />

            <input type="text" placeholder='Search through 1000+ movies' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />

        </div>

      </div>
      
  )
}

export default Search



// Right now, every keystroke in the input field triggers an API call. This is inefficient and can lead to performance issues and excessive API usage. To optimize this, we can implement a debounce mechanism that delays the API call until the user has stopped typing for a short period (e.g., 300 milliseconds). This way, we only make the API call when the user has finished their input, reducing the number of requests made to the server.

// To implement debouncing, we can use the useEffect and useRef hooks from React. The useRef hook will help us keep track of the timeout ID across renders, while useEffect will allow us to set up and clean up the timeout whenever the searchTerm changes.

// Here's how we can modify the Search component to include debouncing:

// import React, { useEffect, useRef } from 'react';

// const Search = ({ searchTerm, setSearchTerm }) => {
//   const debounceTimeout = useRef(null);

//   useEffect(() => {
//     // Clear the previous timeout if searchTerm changes
//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     // Set a new timeout to update the search term after 300ms
//     debounceTimeout.current = setTimeout(() => {
//       setSearchTerm(searchTerm);
//     }, 300);

//     // Cleanup function to clear the timeout when the component unmounts or before the next effect runs
//     return () => {
//       if (debounceTimeout.current) {
//         clearTimeout(debounceTimeout.current);
//       }
//     };
//   }, [searchTerm, setSearchTerm]);

//   return (
//     <div className='search'>
//       <div>
//           <img src="./search.svg" alt="Search Logo" />
//           <input
//             type="text"
//             placeholder='Search through 1000+ movies'
//             value={searchTerm}
//             onChange={(event) => setSearchTerm(event.target.value)}
//           />
//       </div>
//     </div>
//   );
// };

// export default Search;

// With this implementation, the API call to fetch movies will only be triggered after the user has stopped typing for 300 milliseconds, significantly reducing the number of requests made and improving performance.