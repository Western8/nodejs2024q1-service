import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtistRes, Artist } from './entities/artist.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const artistsDb = await this.prisma.artist.findMany();
    const artists = artistsDb.map((item) => instanceToPlain(new Artist(item)));
    console.log('11111111 getall artists', artists);
    return artists;
  }

  async getOne(id: string): Promise<IArtistRes> {
    const artistRes: IArtistRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const artist = await this.prisma.artist.findUnique({ where: { id: id } });
    if (artist === null) {
      return { code: 404 };
    }
    artistRes.artist = instanceToPlain(new Artist(artist));
    return artistRes;
  }

  async create(createArtistDto: CreateArtistDto): Promise<IArtistRes> {
    const artistRes: IArtistRes = { code: 200 };
    const keys: string[] = Object.keys(createArtistDto);
    if (!(keys.includes('name') && keys.includes('grammy'))) {
      return { code: 400 };
    }
    if (
      !(createArtistDto.name && typeof createArtistDto.grammy === 'boolean')
    ) {
      return { code: 400 };
    }

    const params = {
      id: crypto.randomUUID(), // uuid v4
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    const artist = await this.prisma.artist.create({ data: params });
    artistRes.artist = instanceToPlain(new Artist(artist));
    return artistRes;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artistRes: IArtistRes = { code: 200 };
    if (!isUUID(id)) {
      return {
        code: 400,
        message: 'Not valid id',
      };
    }
    const keys: string[] = Object.keys(updateArtistDto);
    if (!(keys.includes('name') && keys.includes('grammy'))) {
      return {
        code: 400,
        message: 'Not valid fields',
      };
    }
    if (
      !(updateArtistDto.name && typeof updateArtistDto.grammy === 'boolean')
    ) {
      return {
        code: 400,
        message: 'Not valid fields',
      };
    }
    const artist = await this.prisma.artist.findUnique({ where: { id: id } });
    if (artist === null) {
      return { code: 404 };
    }
    const artistDb = await this.prisma.artist.update({
      where: { id: id },
      data: {
        name: updateArtistDto.name,
        grammy: updateArtistDto.grammy,
      },
    });
    artistRes.artist = instanceToPlain(new Artist(artistDb));
    return artistRes;
  }

  async delete(id: string) {
    const artistRes: IArtistRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const artist = await this.prisma.artist.findUnique({ where: { id: id } });
    if (artist === null) {
      return { code: 404 };
    }
    await this.prisma.artist.delete({ where: { id: id } });

    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });
    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });
    await this.prisma.favs.deleteMany({
      where: {
        type: 'artist',
        dataId: id,
      },
    });

    return artistRes;
  }
}
