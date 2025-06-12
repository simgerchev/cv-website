import React, { useEffect, useState } from "react";

const SELECTED_ARTISTS = [
  "Leonardo da Vinci",
  "Michelangelo",
  "Peter Paul Rubens",
  "Raphael",
  "Caravaggio"
];

export default function SelectedArtistPainting() {
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPainting = async () => {
    setLoading(true);
    // Pick a random artist from the list
    const artist = SELECTED_ARTISTS[Math.floor(Math.random() * SELECTED_ARTISTS.length)];
    // Search for artworks by that artist
    const searchUrl =
      `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(artist)}&fields=id,title,image_id,artist_title,date_display&limit=100`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    // Filter for works that have images
    const paintingsWithImages = (data.data || []).filter(
      (item) => item.image_id && item.artist_title && item.title
    );
    if (paintingsWithImages.length > 0) {
      const random = paintingsWithImages[Math.floor(Math.random() * paintingsWithImages.length)];
      setPainting(random);
    } else {
      setPainting(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPainting();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="famous-painting-card">
      <h3>Random Artwork by a Selected Master</h3>
      {loading ? (
        <span>Loading...</span>
      ) : painting ? (
        <>
          <div>
            <img
              src={`https://www.artic.edu/iiif/2/${painting.image_id}/full/843,/0/default.jpg`}
              alt={painting.title}
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          </div>
          <div>
            <strong>{painting.title}</strong>
            <br />
            {painting.artist_title} ({painting.date_display})
          </div>
          <button onClick={fetchPainting} style={{ border: 'none'}} className="btn">
            Show Another
          </button>
        </>
      ) : (
        <span>No painting found for selected artists. Try again!</span>
      )}
    </div>
  );
}