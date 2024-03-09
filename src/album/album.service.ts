import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { IAlbumRes, Album } from './entities/album.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const albumsDb = await this.prisma.album.findMany();
    const albums = albumsDb.map((item) => instanceToPlain(new Album(item)));
    return albums;
  }

  async getOne(id: string): Promise<IAlbumRes> {
    const albumRes: IAlbumRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const album = await this.prisma.album.findUnique({ where: { id: id } });
    if (album === null) {
      return { code: 404 };
    }
    albumRes.album = instanceToPlain(new Album(album));
    return albumRes;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<IAlbumRes> {
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

    const params = {
      id: crypto.randomUUID(), // uuid v4
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    const album = await this.prisma.album.create({ data: params });
    albumRes.album = instanceToPlain(new Album(album));
    return albumRes;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
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

    const album = await this.prisma.album.findUnique({ where: { id: id } });
    if (album === null) {
      return { code: 404 };
    }
    const albumDb = await this.prisma.album.update({
      where: { id: id },
      data: {
        name: updateAlbumDto.name,
        year: updateAlbumDto.year,
        artistId: updateAlbumDto.artistId,
      },
    });
    albumRes.album = instanceToPlain(new Album(albumDb));
    return albumRes;
  }

  async delete(id: string) {
    const albumRes: IAlbumRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const album = await this.prisma.album.findUnique({ where: { id: id } });
    if (album === null) {
      return { code: 404 };
    }
    await this.prisma.album.delete({ where: { id: id } });
    await this.prisma.track.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });
    await this.prisma.favs.deleteMany({
      where: {
        type: 'album',
        dataId: id,
      },
    });
    
    return albumRes;
  }
}
