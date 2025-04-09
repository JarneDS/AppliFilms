"use strict";

const searchBar = document.getElementById("searchBar");
const resultBox = document.getElementById("result");
const pagination = document.getElementById("pagination");
const pageInfo = document.getElementById("pageInfo");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");

const API_BASE = "https://web.mayfly.ovh/proxy/movie.php?endpoint=";

let currentPage = 1;
let currentQuery = "";
let totalPages = 1;

searchBar.addEventListener("input", async () => {
  const query = searchBar.value.trim();

  if (query.length < 3) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}search/movie?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
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

// Gérer l’input de recherche
searchBar.addEventListener("input", () => {
  const query = searchBar.value.trim();
  if (query.length < 3) {
    pagination.style.display = "none";
    return;
  }
  chercherFilms(query, 1);
});

// Rechercher films avec pagination
async function chercherFilms(query, page = 1) {
    const endpoint = `search/movie?query=${encodeURIComponent(query)}&page=${page}`;
    const res = await fetch(`${API_BASE}${encodeURIComponent(endpoint)}`);
    const data = await res.json();
    try {
      currentQuery = query;
      currentPage = data.page;
      totalPages = data.total_pages;
  
      // Gestion pagination
      pagination.style.display = totalPages > 1 ? "block" : "none";
      pageInfo.textContent = `Page ${currentPage} sur ${totalPages}`;
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
    } catch (err) {
      console.error("Erreur lors de la recherche :", err);
    }
}

// Boutons pagination
prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
    chercherFilms(currentQuery, currentPage - 1);
    }
});

nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
    chercherFilms(currentQuery, currentPage + 1);
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
    
    // Trier les films par titre dans l'ordre alphabétique
    films.sort((b, a) => a.release_date.localeCompare(b.release_date));
  
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
            <p><strong>Titre originale :</strong> ${film.original_title}</p>
            <p><strong>ID :</strong> ${film.id}</p>
            <p><strong>Popularité :</strong> ${film.popularity}</p>
          </div>
          ${film.poster_path ? `<img src="https://image.tmdb.org/t/p/w300${film.poster_path}" alt="${film.title}">` : ""}
        </div>
      `;
  
      // Ajouter chaque film au conteneur de résultats
      resultBox.appendChild(filmDiv);
    });
  }
  
