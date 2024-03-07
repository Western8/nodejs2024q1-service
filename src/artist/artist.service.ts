import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtistRes, Artist } from './entities/artist.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
// import { db } from 'src/utils/db';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const artistsDb = await this.prisma.artist.findMany();
    const artists = artistsDb.map((item) => instanceToPlain(new Artist(item)));
    //const artists = db.artists.map((item) => instanceToPlain(item));
    console.log('11111111 getall artists', artists);
    return artists;
  }

  async getOne(id: string): Promise<IArtistRes> {
    const artistRes: IArtistRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const artist = await this.prisma.artist.findUnique({ where: { id: id } });
    //const artist = db.artists.find((item) => item.id === id);
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
    //db.artists.push(artist);
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
    //const artist = db.artists.find((item) => item.id === id);
    //if (!artist) {
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
    // artist.name = updateArtistDto.name;
    // artist.grammy = updateArtistDto.grammy;
    artistRes.artist = instanceToPlain(new Artist(artistDb));
    return artistRes;
  }

  async delete(id: string) {
    const artistRes: IArtistRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const artist = await this.prisma.artist.findUnique({ where: { id: id } });
    // const index = db.artists.findIndex((item) => item.id === id);
    // if (index === -1) {
    if (artist === null) {
      return { code: 404 };
    }
    await this.prisma.artist.delete({ where: { id: id } });
    // db.artists.splice(index, 1);

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
    /*
    const albums = await this.prisma.album.findMany({ where: { artistId: id } });
    const albums = db.albums.filter((item) => item.artistId === id);
    albums.forEach((item) => (item.artistId = null));
    const tracks = db.tracks.filter((item) => item.artistId === id);
    tracks.forEach((item) => (item.artistId = null));
    const indexFavs = db.favs.artists.findIndex((item) => item === id);
    if (indexFavs !== -1) {
      db.favs.artists.splice(indexFavs, 1);
    }
*/
    return artistRes;
  }
}
