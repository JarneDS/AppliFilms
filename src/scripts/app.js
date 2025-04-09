"use strict";

const searchBar = document.getElementById("searchBar");
const resultBox = document.getElementById("result");

const API_BASE = "https://web.mayfly.ovh/proxy/movie.php?endpoint=";

searchBar.addEventListener("input", async () => {
  const query = searchBar.value.trim();

  if (query.length < 3) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}search/movie?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      document.getElementById("result").classList.remove("hidden");
      afficherFilms(data.results);
    } else {
      resultBox.innerHTML = "<p>Film non trouvé.</p>";
    }
  } catch (err) {
    console.error("Erreur lors de la recherche :", err);
  }
});

searchBar.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    rechercherFilmParTitre(searchBar.value);
  }
});

async function rechercherFilmParTitre(titre) {
  try {
    const res = await fetch(`${API_BASE}search/movie?query=${encodeURIComponent(titre)}`);
    const data = await res.json();

    document.getElementById("result").classList.remove("hidden");
    if (data.results && data.results.length > 0) {
      afficherFilms(data.results);
    } else {
      resultBox.innerHTML = "<p>Film non trouvé.</p>";
    }
  } catch (err) {
    console.error("Erreur de recherche par titre :", err);
    resultBox.innerHTML = "<p>Erreur lors de la recherche.</p>";
  }
}

function afficherFilms(films) {
  // On vide la boîte des résultats avant d'afficher les nouveaux
  resultBox.innerHTML = "";

  films.forEach(film => {
    // Créer un conteneur pour chaque film
    const filmDiv = document.createElement("div");
    filmDiv.className = "film";

    // Ajouter les informations sur le film
    filmDiv.innerHTML = `
      <div class="flex">
        <div>
          <h2>${film.title} (${film.release_date?.split("-")[0] ?? "Année inconnue"})</h2>
          <p><strong>Langue originale :</strong> ${film.original_language}</p>
          <p><strong>Résumé :</strong> ${film.overview}</p>
        </div>
        ${film.poster_path ? `<img src="https://image.tmdb.org/t/p/w300${film.poster_path}" alt="${film.title}">` : ""}
      </div>
    `;

    // Ajouter chaque film au conteneur de résultats
    resultBox.appendChild(filmDiv);
  });
}
