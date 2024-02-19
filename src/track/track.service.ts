import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrackRes, Track } from './entities/track.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { db } from 'src/utils/db';

@Injectable()
export class TrackService {
  //tracks: Track[] = [];
  getAll() {
    const tracks = db.tracks.map(item => instanceToPlain(item));
    return tracks;
  }

  getOne(id: string): ITrackRes {
    const trackRes: ITrackRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    const track = db.tracks.find(item => item.id === id);
    if (!track) {
      return { code: 404 }
    }
    trackRes.track = instanceToPlain(track);
    return trackRes;
  }

  create(createTrackDto: CreateTrackDto): ITrackRes {
    const trackRes: ITrackRes = { code: 200 };
    const keys: string[] = Object.keys(createTrackDto);
    if (!(keys.includes('name') && keys.includes('duration') && keys.includes('artistId') && keys.includes('albumId'))) {
      return { code: 400 }
    }
    if (!(createTrackDto.name && (typeof(createTrackDto.duration) === 'number'))) {
      return { code: 400 }
    }
    if (!(isUUID(createTrackDto.artistId) && isUUID(createTrackDto.albumId))) {
      return { code: 400 }
    }

    const params = {
      id: crypto.randomUUID(), // uuid v4
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
    }
    const track: Track = new Track(params);
    db.tracks.push(track);
    trackRes.track = instanceToPlain(track);
    return trackRes;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const trackRes: ITrackRes = { code: 200 };
    if (!isUUID(id)) {
      return {
        code: 400,
        message: 'Not valid id',
      }
    }
    const keys: string[] = Object.keys(updateTrackDto);
    if (!(keys.includes('name') && keys.includes('duration') && keys.includes('artistId') && keys.includes('albumId'))) {
      return { 
        code: 400,
        message: 'Not valid fields',
       }
    }
    if (!(updateTrackDto.name && (typeof(updateTrackDto.duration) === 'number'))) {
      return {
        code: 400,
        message: 'Not valid fields',
      }
    }
    if (!(isUUID(updateTrackDto.artistId) && isUUID(updateTrackDto.albumId))) {
      return {
        code: 400,
        message: 'Not valid fields (id)',
      }
    }
    const track = db.tracks.find(item => item.id === id);
    if (!track) {
      return { code: 404 }
    }
    track.name = updateTrackDto.name;
    track.duration = updateTrackDto.duration;
    track.artistId = updateTrackDto.artistId;
    track.albumId = updateTrackDto.albumId;
    trackRes.track = instanceToPlain(track);
    return trackRes;
  }

  delete(id: string) {
    const trackRes: ITrackRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    const index = db.tracks.findIndex(item => item.id === id);
    if (index === -1) {
      return { code: 404 }
    }
    db.tracks.splice(index, 1);

    const indexFavs = db.favs.tracks.findIndex(item => item === id);
    if (indexFavs !== -1) {
      db.favs.tracks.splice(indexFavs, 1);
    }

    return trackRes;
  }
}
