import { Injectable } from '@nestjs/common';
import { IFavsRes, Favs } from './entities/favs.entity';
import { isUUID } from 'src/utils/utils';
import { db } from 'src/utils/db';

@Injectable()
export class FavsService {
  getAll() {
    const artists = db.favs.artists.map(item => db.artists.find(itemArtists => itemArtists.id === item));
    const albums = db.favs.albums.map(item => db.albums.find(itemAlbums => itemAlbums.id === item));
    const tracks = db.favs.tracks.map(item => db.tracks.find(itemTracks => itemTracks.id === item));
    const favs = {
      artists,
      albums,
      tracks,
    }
    return favs;
  }

  add(resource: string, id: string): IFavsRes {
    const favsRes: IFavsRes = { code: 201 };
    if (!isUUID(id)) {
      return {
        code: 400,
        message: 'Not valid id',
      }
    }
    const resourceFind = db[resource].find(item => item.id === id);
    if (!resourceFind) {
      return {
        code: 422,
        message: `${resource} with id ${id} not found`,
      }
    }
   if (!db.favs[resource].includes(id)) {
     db.favs[resource].push(id);
   }
    return favsRes;
  }

  delete(resource: string, id: string) {
    const favsRes: IFavsRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    
    const index = db.favs[resource].findIndex(item => item === id);
    if (index === -1) {
      return { code: 404 }
    }
    db.favs[resource].splice(index, 1);

    return favsRes;
  }
}
