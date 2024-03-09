import { Injectable } from '@nestjs/common';
import { IFavsRes } from './entities/favs.entity';
import { isUUID } from 'src/utils/utils';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const artistsDb = await this.prisma.favs.findMany({
      where: { type: 'artist' },
    });
    const artists = await Promise.all(
      artistsDb.map(
        async (item) =>
          await this.prisma.artist.findUnique({ where: { id: item.dataId } }),
      ),
    );
    const albumsDb = await this.prisma.favs.findMany({
      where: { type: 'album' },
    });
    const albums = await Promise.all(
      albumsDb.map(
        async (item) =>
          await this.prisma.album.findUnique({ where: { id: item.dataId } }),
      ),
    );
    const tracksDb = await this.prisma.favs.findMany({
      where: { type: 'track' },
    });
    const tracks = await Promise.all(
      tracksDb.map(
        async (item) =>
          await this.prisma.track.findUnique({ where: { id: item.dataId } }),
      ),
    );
    const favs = {
      artists,
      albums,
      tracks,
    };
    return favs;
  }

  async add(resource: string, id: string): Promise<IFavsRes> {
    const favsRes: IFavsRes = { code: 201 };
    if (!isUUID(id)) {
      return {
        code: 400,
        message: 'Not valid id',
      };
    }
    let resourceFind = null;
    if (resource === 'artist') {
      resourceFind = await this.prisma.artist.findUnique({ where: { id: id } });
    } else if (resource === 'album') {
      resourceFind = await this.prisma.album.findUnique({ where: { id: id } });
    } else if (resource === 'track') {
      resourceFind = await this.prisma.track.findUnique({ where: { id: id } });
    }
    if (resourceFind === null) {
      return {
        code: 422,
        message: `${resource} with id ${id} not found`,
      };
    }
    const favsFind = await this.prisma.favs.findFirst({
      where: { dataId: id },
    });
    if (favsFind === null) {
      const params = {
        id: crypto.randomUUID(), // uuid v4
        type: resource,
        dataId: id,
      };
      await this.prisma.favs.create({ data: params });
    }
    return favsRes;
  }

  async delete(resource: string, id: string) {
    const favsRes: IFavsRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 };
    }

    const favsFind = await this.prisma.favs.findFirst({
      where: {
        type: resource,
        dataId: id,
      },
    });
    if (favsFind === null) {
      return { code: 404 };
    }
    await this.prisma.favs.deleteMany({
      where: {
        type: resource,
        dataId: id,
      },
    });

    return favsRes;
  }
}
