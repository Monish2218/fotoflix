import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Photos from './components/photos';
import Favourite from './components/favourites';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const clientID = `?client_id=vpwYTgTtMnKlJaExnJ5-d5HRHPmDRLPB7E-bxzErPrg`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const [favoritePhotos, setFavoritePhotos] = useState([]);

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhoto) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhoto, ...data.results];
        } else {
          return [...oldPhoto, ...data];
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });
    return () => window.removeEventListener('scroll', event);
  }, [loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  };

  const handleFavoriteClick = (photo) => {
    const existingIndex = favoritePhotos.findIndex(
      (favPhoto) => favPhoto.id === photo.id
    );

    if (existingIndex !== -1) {
      // If the photo is already in favorites, remove it
      setFavoritePhotos((prevFavorites) =>
        prevFavorites.filter((favPhoto) => favPhoto.id !== photo.id)
      );
    } else {
      // If the photo is not in favorites, add it
      setFavoritePhotos((prevFavorites) => [...prevFavorites, photo]);
    }
  };

  return (
    <Router>
      <div>
        {/* Sticky Navbar */}
        <nav className="navbar">
          <div className="navbar__logo">Fotoflix</div>
          <form action="" className="navbar__search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="search"
              className="form-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              <FaSearch />
            </button>
          </form>
          <div className="navbar__links">
            <Link to="/favourites">Favourites</Link>
          </div>
        </nav>

        {/* Router Switch */}
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <section className="photos">
                  <div className="photos-center">
                    {photos.map((image, index) => {
                      const isFavorite = favoritePhotos.some(
                        (favPhoto) => favPhoto.id === image.id
                      );
                      return (
                        <Photos
                          key={index}
                          {...image}
                          onFavoriteClick={() => handleFavoriteClick(image)} // Pass the handleFavoriteClick function here
                          isFavorite={isFavorite} // Pass the isFavorite status here
                        >
                          {/* Pass isFavorite to Photos to show the favorite status */}
                          {isFavorite ? <span>Added to Favorites</span> : null}
                        </Photos>
                      );
                    })}
                  </div>
                </section>
              </main>
            }
          />
          <Route
            path="/favourites"
            element={
              <Favourite
                favoritePhotos={favoritePhotos}
                handleRemoveFavorite={handleFavoriteClick} // Pass the handleFavoriteClick function here
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;