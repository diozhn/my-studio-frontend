"use client";
import React, { useEffect, useState } from "react";
import Menu from "./components/menu";
import { getArtworks, ArtWork } from "./services/artwork/artwork";

function shuffleAndResize(artworks: ArtWork[]) {
  return artworks
    .map((art) => ({
      ...art,
      size: Math.floor(Math.random() * 2) ? "row-span-2" : "row-span-1",
      width: Math.floor(Math.random() * 2) ? "col-span-2" : "col-span-1",
    }))
    .sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [artworks, setArtworks] = useState<ArtWork[]>([]);
  const [filtered, setFiltered] = useState<ArtWork[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchArtworks = async (title?: string) => {
    setLoading(true);
    const data = await getArtworks({ title });
    const shuffled = shuffleAndResize(data.results);
    setArtworks(shuffled);
    setFiltered(shuffled);
    setLoading(false);
  };

  useEffect(() => {
    fetchArtworks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (search.length === 0) {
      setFiltered(artworks);
    } else {
      setFiltered(
        artworks.filter((art) =>
          art.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, artworks]);

  return (
    <>
      <Menu />
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Filtrar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-4 py-2 w-full max-w-md"
          />
          <button
            className="ml-2 px-4 py-2 rounded bg-rose-700 text-white"
            onClick={() => fetchArtworks(search)}
          >
            Buscar
          </button>
        </div>
        {loading ? (
          <div className="text-center text-lg">Carregando...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
            {filtered.map((art) => (
              <div
                key={art.id}
                className={`bg-white/80 rounded shadow overflow-hidden flex flex-col justify-between ${art.size} ${art.width}`}
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
              >
                <img
                  src={art.image_url}
                  alt={art.title}
                  className="object-cover w-full h-full"
                />
                <div className="p-2">
                  <div className="font-semibold truncate">{art.title}</div>
                  <div className="text-xs text-gray-500">{art.caption}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}