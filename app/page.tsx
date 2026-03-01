"use client";
import React, { useEffect, useState } from "react";
import Menu from "./components/menu";
import { getArtworks, ArtWork } from "./services/artwork/artwork";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Loader2, Heart } from "lucide-react";
import { getImageUrl } from "./utils/image";

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
  const [selectedArtwork, setSelectedArtwork] = useState<ArtWork | null>(null);

  const fetchArtworks = async (title?: string) => {
    setLoading(true);
    try {
      const data = await getArtworks({ title });
      const shuffled = shuffleAndResize(data.results);
      setArtworks(shuffled);
      setFiltered(shuffled);
    } catch (error) {
      console.error("Erro ao carregar artworks:", error);
    } finally {
      setLoading(false);
    }
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
      <main className="pt-20 pb-12 px-4 md:px-6 lg:px-8 min-h-screen bg-background">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
          </div>

          {/* Search Section */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Button
              onClick={() => fetchArtworks(search)}
              variant="default"
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando obras de arte...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Nenhuma obra encontrada</h3>
              <p className="text-muted-foreground text-center">
                {search
                  ? "Tente buscar com outros termos"
                  : "Ainda não há obras na galeria"}
              </p>
            </div>
          ) : (
            /* Artworks Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]">
              {filtered.map((art) => (
                <Card
                  key={art.id}
                  className={`group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 ${art.size} ${art.width} flex flex-col`}
                  onClick={() => setSelectedArtwork(art)}
                >
                  <div className="relative flex-1 overflow-hidden bg-muted">
                    <img
                      src={getImageUrl((art.image_url || art.imageUrl) as string)}
                      alt={art.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback para uma imagem placeholder em caso de erro
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagem não disponível%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge variant="secondary" className="gap-1">
                        <Heart className="h-3 w-3" />
                        {art.likes || 0}
                      </Badge>
                    </div>
                  </div>
                  <CardFooter className="flex flex-col items-start gap-1 p-4 bg-card">
                    <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {art.caption}
                    </p>
                    {art.created_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(art.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loading && filtered.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Mostrando {filtered.length} {filtered.length === 1 ? "obra" : "obras"}
                {search && ` para "${search}"`}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      <Dialog open={!!selectedArtwork} onOpenChange={(open) => !open && setSelectedArtwork(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 gap-0">
          {selectedArtwork && (
            <>
              <div className="relative w-full h-full flex items-center justify-center bg-background overflow-auto">
                <img
                  src={getImageUrl((selectedArtwork.image_url || selectedArtwork.imageUrl) as string)}
                  alt={selectedArtwork.title}
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagem não disponível%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="border-t bg-card p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl">{selectedArtwork.title}</DialogTitle>
                  <DialogDescription className="text-base mt-2">
                    {selectedArtwork.caption}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Heart className="h-4 w-4" />
                      {selectedArtwork.likes || 0} {selectedArtwork.likes === 1 ? "curtida" : "curtidas"}
                    </Badge>
                  </div>
                  {selectedArtwork.created_at && (
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedArtwork.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
