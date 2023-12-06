import React, {useState}from 'react';
import {FaHeart, FaDownload, FaShare } from 'react-icons/fa';
import 'lightbox.js-react/dist/index.css'
import {Image} from 'lightbox.js-react'

const Photos = ({
    id,
    urls: { regular, full }, // Add the full-size image URL
    alt_description,
    likes,
    user: { name, portfolio_url, profile_image: { medium } },
    onFavoriteClick,
    isFavorite,
  }) => {
    const [isPhotoFavorite, setIsPhotoFavorite] = useState(isFavorite);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
    const handleFavoriteClick = () => {
      setIsPhotoFavorite(!isPhotoFavorite);
      onFavoriteClick({
        id,
        urls: { regular, full }, // Pass the full-size image URL when updating favorite status
        alt_description,
        likes,
        user: { name, portfolio_url, profile_image: { medium } },
      });
    };
  
    const handleShare = () => {
      const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Check out this awesome photo: ${regular}`
      )}`;
      window.open(shareUrl, '_blank');
    };
  
    const openLightbox = () => {
      setIsLightboxOpen(true);
    };
  
    const closeLightbox = () => {
      setIsLightboxOpen(false);
    };
  
    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = full;
      link.download = `photo_${id}.jpg`; // You can customize the downloaded file name here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
        <article className="photo">
      <img src={regular} alt={alt_description} onClick={openLightbox} />
      <div className="photo-info">
        <div className="photo-header">
          <h4>{name}</h4>
          <button className={`favorite-btn ${isPhotoFavorite ? 'active' : ''}`} onClick={handleFavoriteClick}>
            <span role="img" aria-label="Favorite">
              {isPhotoFavorite ? '❤️' : '♡'}
            </span>
          </button>
        </div>
        <div className="photo-actions">
          <p>
            <FaHeart className="heart-icon" /> {likes}
          </p>
          <button className="share-btn" onClick={handleShare}>
            <FaShare className="share-icon" />
          </button>
          <button className="download-btn" onClick={handleDownload}>
            <FaDownload className="download-icon" />
          </button>
        </div>
        <a href={portfolio_url}>
          <img src={medium} className="user-img" alt="" />
        </a>
      </div>

      {isLightboxOpen && (
        <Image image={{src:regular, title:"Photo"}}
          mainSrc={regular}
          onCloseRequest={closeLightbox}
          imageCaption={
            <div className="photo-info">
              <div className="photo-header">
                <h4>{name}</h4>
                <button className={`favorite-btn ${isPhotoFavorite ? 'active' : ''}`} onClick={handleFavoriteClick}>
                  <span role="img" aria-label="Favorite">
                    {isPhotoFavorite ? '❤️' : '♡'}
                  </span>
                </button>
              </div>
              <div className="photo-actions">
                <p>
                  <FaHeart className="heart-icon" /> {likes}
                </p>
                <button className="share-btn" onClick={handleShare}>
                  <FaShare className="share-icon" />
                </button>
                <button className="download-btn" onClick={handleDownload}>
                  <FaDownload className="download-icon" />
                </button>
              </div>
              <a href={portfolio_url}>
                <img src={medium} className="user-img" alt="" />
              </a>
            </div>
          }
        />
      )}
    </article>
    );
}

export default Photos;