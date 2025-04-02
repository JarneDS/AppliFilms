"use strict";

const apiURL = `https://web.mayfly.ovh/proxy/movie.php?endpoint=search/movie?query=avengers`;

  fetch(apiURL)
      .then(response => {
          if (!response.ok) {
              throw new Error('Film pas trouver');
          }
          return response.json();
      })