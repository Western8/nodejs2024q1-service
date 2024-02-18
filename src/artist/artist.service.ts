import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtistRes, Artist } from './entities/artist.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ArtistService {
  artists: Artist[] = [];
  getAll() {
    const artists = this.artists.map(item => instanceToPlain(item));
    return artists;
  }

  getOne(id: string): IArtistRes {
    const artistRes: IArtistRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    const artist = this.artists.find(item => item.id === id);
    if (!artist) {
      return { code: 404 }
    }
    artistRes.artist = instanceToPlain(artist);
    return artistRes;
  }

  create(createArtistDto: CreateArtistDto): IArtistRes {
    const artistRes: IArtistRes = { code: 200 };
    const keys: string[] = Object.keys(createArtistDto);
    if (!(keys.includes('name') && keys.includes('grammy'))) {
      return { code: 400 }
    }
    if (!(createArtistDto.name && (typeof(createArtistDto.grammy) === 'boolean'))) {
      return { code: 400 }
    }

    const params = {
      id: crypto.randomUUID(), // uuid v4
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    }
    const artist: Artist = new Artist(params);
    this.artists.push(artist);
    artistRes.artist = instanceToPlain(artist);
    return artistRes;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artistRes: IArtistRes = { code: 200 };
    if (!isUUID(id)) {
      return {
        code: 400,
        message: 'Not valid id',
      }
    }
    const keys: string[] = Object.keys(updateArtistDto);
    if (!(keys.includes('name') && keys.includes('grammy'))) {
      return { 
        code: 400,
        message: 'Not valid fields',
       }
    }
    if (!(updateArtistDto.name && (typeof(updateArtistDto.grammy) === 'boolean'))) {
      return {
        code: 400,
        message: 'Not valid fields',
      }
    }
    const artist = this.artists.find(item => item.id === id);
    if (!artist) {
      return { code: 404 }
    }
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
    artistRes.artist = instanceToPlain(artist);
    return artistRes;
  }

  delete(id: string) {
    const artistRes: IArtistRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    const index = this.artists.findIndex(item => item.id === id);
    if (index === -1) {
      return { code: 404 }
    }
    this.artists.splice(index, 1);
    return artistRes;
  }
}
