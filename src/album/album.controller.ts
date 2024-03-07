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
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { IAlbumRes } from './entities/album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAll() {
    return await this.albumService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const albumRes: IAlbumRes = await this.albumService.getOne(id);
    if (albumRes.code === 400) {
      throw new BadRequestException('Not valid user id');
    } else if (albumRes.code === 404) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return albumRes.album;
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    const albumRes: IAlbumRes = await this.albumService.create(createAlbumDto);
    if (albumRes.code === 400) {
      throw new BadRequestException('Not valid album fields');
    }
    return albumRes.album;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    const albumRes: IAlbumRes = await this.albumService.update(
      id,
      updateAlbumDto,
    );
    if (albumRes.code === 400) {
      throw new BadRequestException(albumRes.message);
    } else if (albumRes.code === 404) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return albumRes.album;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const albumRes: IAlbumRes = await this.albumService.delete(id);
    if (albumRes.code === 400) {
      throw new BadRequestException('Not valid album id');
    } else if (albumRes.code === 404) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }
}
