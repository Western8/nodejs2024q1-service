import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtistRes, Artist } from './entities/artist.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { db } from 'src/utils/db';

@Injectable()
export class ArtistService {
  //artists: Artist[] = [];
  getAll() {
    const artists = db.artists.map(item => instanceToPlain(item));
    return artists;
  }

  getOne(id: string): IArtistRes {
    const artistRes: IArtistRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    const artist = db.artists.find(item => item.id === id);
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
    db.artists.push(artist);
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
    const artist = db.artists.find(item => item.id === id);
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
    const index = db.artists.findIndex(item => item.id === id);
    if (index === -1) {
      return { code: 404 }
    }
    db.artists.splice(index, 1);

    const albums = db.albums.filter(item => item.artistId === id);
    albums.forEach(item => item.artistId = null);
    const tracks = db.tracks.filter(item => item.artistId === id);
    tracks.forEach(item => item.artistId = null);

    return artistRes;
  }
}
