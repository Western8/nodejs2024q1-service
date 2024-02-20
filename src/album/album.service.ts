import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { IAlbumRes, Album } from './entities/album.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { db } from 'src/utils/db';

@Injectable()
export class AlbumService {
  //albums: Album[] = [];
  getAll() {
    const albums = db.albums.map((item) => instanceToPlain(item));
    return albums;
  }

  getOne(id: string): IAlbumRes {
    const albumRes: IAlbumRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const album = db.albums.find((item) => item.id === id);
    if (!album) {
      return { code: 404 };
    }
    albumRes.album = instanceToPlain(album);
    return albumRes;
  }

  create(createAlbumDto: CreateAlbumDto): IAlbumRes {
    const albumRes: IAlbumRes = { code: 200 };
    const keys: string[] = Object.keys(createAlbumDto);
    if (
      !(
        keys.includes('name') &&
        keys.includes('year') &&
        keys.includes('artistId')
      )
    ) {
      return { code: 400 };
    }
    if (!(createAlbumDto.name && typeof createAlbumDto.year === 'number')) {
      return { code: 400 };
    }
    /*
    if (!isUUID(createAlbumDto.artistId)) {
      return { code: 400 };
    }
    */

    const params = {
      id: crypto.randomUUID(), // uuid v4
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    const album: Album = new Album(params);
    db.albums.push(album);
    albumRes.album = instanceToPlain(album);
    return albumRes;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const albumRes: IAlbumRes = { code: 200 };
    if (!isUUID(id)) {
      return {
        code: 400,
        message: 'Not valid id',
      };
    }
    const keys: string[] = Object.keys(updateAlbumDto);
    if (
      !(
        keys.includes('name') &&
        keys.includes('year') &&
        keys.includes('artistId')
      )
    ) {
      return {
        code: 400,
        message: 'Not valid fields',
      };
    }
    if (!(updateAlbumDto.name && typeof updateAlbumDto.year === 'number')) {
      return {
        code: 400,
        message: 'Not valid fields',
      };
    }
    /*
    if (!isUUID(updateAlbumDto.artistId)) {
      return {
        code: 400,
        message: 'Not valid fields (artistId)',
      };
    }
    */

    const album = db.albums.find((item) => item.id === id);
    if (!album) {
      return { code: 404 };
    }
    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;
    albumRes.album = instanceToPlain(album);
    return albumRes;
  }

  delete(id: string) {
    const albumRes: IAlbumRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const index = db.albums.findIndex((item) => item.id === id);
    if (index === -1) {
      return { code: 404 };
    }
    db.albums.splice(index, 1);

    const tracks = db.tracks.filter((item) => item.albumId === id);
    tracks.forEach((item) => (item.albumId = null));
    const indexFavs = db.favs.albums.findIndex((item) => item === id);
    if (indexFavs !== -1) {
      db.favs.albums.splice(indexFavs, 1);
    }

    return albumRes;
  }
}
