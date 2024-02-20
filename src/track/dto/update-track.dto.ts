import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}
