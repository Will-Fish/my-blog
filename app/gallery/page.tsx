import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { GalleryClient } from "@/components/GalleryClient";
import { Header } from "@/components/Header";
import { getPhotographyImages } from "@/lib/photography";

export const metadata: Metadata = {
  title: "摄影",
  description: "许多念念不忘，皆是一瞬；许多一瞬，却是念念不忘；",
};

export default async function GalleryPage() {
  const galleryItems = await getPhotographyImages();

  return (
    <>
      <Header currentPath="/gallery" />
      <main className="section-gap">
        <div className="page-shell">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-primary">摄影</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight">镜头之外，世界之中</h1>
            <p className="mt-5 text-lg leading-8 text-text-muted">
              拍照不用想太深，什么霎那间的永恒，谁咬定自己不是过客
            </p>
          </div>
          <GalleryClient images={galleryItems} />
        </div>
      </main>
      <Footer />
    </>
  );
}
