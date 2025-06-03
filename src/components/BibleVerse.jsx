import { useEffect, useState } from "react";

const NT_BOOKS = [
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];

export default function BibleVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVerse = () => {
    setLoading(true);
    // Keep fetching until we get a NT verse
    const tryFetch = () => {
      fetch("https://labs.bible.org/api/?passage=random&type=json")
        .then(res => res.json())
        .then(data => {
          if (NT_BOOKS.includes(data[0].bookname)) {
            setVerse(data[0]);
            setLoading(false);
          } else {
            tryFetch(); // Try again if not NT
          }
        });
    };
    tryFetch();
  };

  useEffect(() => {
    fetchVerse();
  }, []);

  return (
    <div className="bible-verse-card fancy">
      <div className="bible-verse-quote-icon">❝</div>
      {loading ? (
        <span className="bible-verse-loading">Loading verse...</span>
      ) : (
        <>
          <blockquote className="bible-verse-text">
            {verse.text.trim()}
          </blockquote>
          <div className="bible-verse-ref">
            — {verse.bookname} {verse.chapter}:{verse.verse}
          </div>
        </>
      )}
      <button className="bible-verse-refresh" onClick={fetchVerse} title="Show another verse">
        ↻
      </button>
    </div>
  );
}