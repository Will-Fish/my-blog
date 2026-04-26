import photographyData from "@/generated/photography.json";

export type PhotographyImage = {
  id: string;
  title: string;
  largeSrc: string;
  thumbSrc: string;
  width: number;
  height: number;
};

const photographyImages = photographyData as PhotographyImage[];

export async function getPhotographyImages(): Promise<PhotographyImage[]> {
  return photographyImages;
}
