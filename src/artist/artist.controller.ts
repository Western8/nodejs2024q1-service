import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  Put,
  HttpCode,
//  UseGuards,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtistRes } from './entities/artist.entity';
//import { AuthGuard } from 'src/auth/auth.guard';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

//  @UseGuards(AuthGuard)
  @Get()
  async getAll() {
    return await this.artistService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const artistRes: IArtistRes = await this.artistService.getOne(id);
    if (artistRes.code === 400) {
      throw new BadRequestException('Not valid user id');
    } else if (artistRes.code === 404) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artistRes.artist;
  }

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    const artistRes: IArtistRes = await this.artistService.create(
      createArtistDto,
    );
    if (artistRes.code === 400) {
      throw new BadRequestException('Not valid artist fields');
    }
    return artistRes.artist;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const artistRes: IArtistRes = await this.artistService.update(
      id,
      updateArtistDto,
    );
    if (artistRes.code === 400) {
      throw new BadRequestException(artistRes.message);
    } else if (artistRes.code === 404) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artistRes.artist;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const artistRes: IArtistRes = await this.artistService.delete(id);
    if (artistRes.code === 400) {
      throw new BadRequestException('Not valid artist id');
    } else if (artistRes.code === 404) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
