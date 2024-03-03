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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrackRes } from './entities/track.entity';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAll() {
    return await this.trackService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const trackRes: ITrackRes = await this.trackService.getOne(id);
    if (trackRes.code === 400) {
      throw new BadRequestException('Not valid user id');
    } else if (trackRes.code === 404) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return trackRes.track;
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    const trackRes: ITrackRes = await this.trackService.create(createTrackDto);
    if (trackRes.code === 400) {
      throw new BadRequestException('Not valid track fields');
    }
    return trackRes.track;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    const trackRes: ITrackRes = await this.trackService.update(id, updateTrackDto);
    if (trackRes.code === 400) {
      throw new BadRequestException(trackRes.message);
    } else if (trackRes.code === 404) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return trackRes.track;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const trackRes: ITrackRes = await this.trackService.delete(id);
    if (trackRes.code === 400) {
      throw new BadRequestException('Not valid track id');
    } else if (trackRes.code === 404) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }
}
