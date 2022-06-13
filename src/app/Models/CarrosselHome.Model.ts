// Arquivo: src/app/Models/CarrosselHome.Model.ts
import { ImageDetails } from './ImageDetails.Model';
import { InfoDetailsCarousel } from './InfoDetailsCarousel.Model';
export interface CarrosselHome{
  image?:ImageDetails;
  info?:InfoDetailsCarousel;
}
