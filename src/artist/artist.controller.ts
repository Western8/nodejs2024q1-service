import { Controller, Get, Post, Body, Patch, Param, Delete, Res, BadRequestException, NotFoundException, ForbiddenException, Put, HttpCode } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { response } from 'express';
import { IArtistRes } from './entities/artist.entity';
import { classToPlain, instanceToPlain, serialize } from 'class-transformer';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}
  
  @Get()
  getAll() {
    return this.artistService.getAll();
  }
  
  @Get(':id')
  getOne(@Param('id') id: string) {
    const artistRes: IArtistRes = this.artistService.getOne(id);
    if (artistRes.code === 400) {
      throw new BadRequestException('Not valid user id');
    } else if ((artistRes.code === 404)) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artistRes.artist;
  }
  
  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    const artistRes: IArtistRes = this.artistService.create(createArtistDto);
    if (artistRes.code === 400) {
      throw new BadRequestException('Not valid artist fields');
    }
    return artistRes.artist;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    const artistRes: IArtistRes = this.artistService.update(id, updateArtistDto);
    if (artistRes.code === 400) {
      throw new BadRequestException(artistRes.message);
    } else if ((artistRes.code === 404)) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artistRes.artist;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    const artistRes: IArtistRes = this.artistService.delete(id);
    if (artistRes.code === 400) {
      throw new BadRequestException('Not valid artist id');
    } else if ((artistRes.code === 404)) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
