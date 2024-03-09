import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrackRes, Track } from './entities/track.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const tracksDb = await this.prisma.track.findMany();
    const tracks = tracksDb.map((item) => instanceToPlain(new Track(item)));
    return tracks;
  }

  async getOne(id: string): Promise<ITrackRes> {
    const trackRes: ITrackRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const track = await this.prisma.track.findUnique({ where: { id: id } });
    if (track === null) {
      return { code: 404 };
    }
    trackRes.track = instanceToPlain(new Track(track));
    return trackRes;
  }

  async create(createTrackDto: CreateTrackDto): Promise<ITrackRes> {
    const trackRes: ITrackRes = { code: 200 };
    const keys: string[] = Object.keys(createTrackDto);
    if (
      !(
        keys.includes('name') &&
        keys.includes('duration') &&
        keys.includes('artistId') &&
        keys.includes('albumId')
      )
    ) {
      return { code: 400 };
    }
    if (!(createTrackDto.name && typeof createTrackDto.duration === 'number')) {
      return { code: 400 };
    }

    const params = {
      id: crypto.randomUUID(), // uuid v4
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
    };
    const track = await this.prisma.track.create({ data: params });
    trackRes.track = instanceToPlain(new Track(track));
    return trackRes;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const trackRes: ITrackRes = { code: 200 };
    if (!isUUID(id)) {
      return {
        code: 400,
        message: 'Not valid id',
      };
    }
    const keys: string[] = Object.keys(updateTrackDto);
    if (
      !(
        keys.includes('name') &&
        keys.includes('duration') &&
        keys.includes('artistId') &&
        keys.includes('albumId')
      )
    ) {
      return {
        code: 400,
        message: 'Not valid fields',
      };
    }
    if (!(updateTrackDto.name && typeof updateTrackDto.duration === 'number')) {
      return {
        code: 400,
        message: 'Not valid fields',
      };
    }

    const track = await this.prisma.track.findUnique({ where: { id: id } });
    if (track === null) {
      return { code: 404 };
    }
    const trackDb = await this.prisma.track.update({
      where: { id: id },
      data: {
        name: updateTrackDto.name,
        duration: updateTrackDto.duration,
        artistId: updateTrackDto.artistId,
        albumId: updateTrackDto.albumId,
      },
    });
    trackRes.track = instanceToPlain(new Track(trackDb));
    return trackRes;
  }

  async delete(id: string) {
    const trackRes: ITrackRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const track = await this.prisma.track.findUnique({ where: { id: id } });
    if (track === null) {
      return { code: 404 };
    }
    await this.prisma.track.delete({ where: { id: id } });
    await this.prisma.favs.deleteMany({
      where: {
        type: 'track',
        dataId: id,
      },
    });
    return trackRes;
  }
}
