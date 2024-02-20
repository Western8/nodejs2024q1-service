import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  HttpCode,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { IFavsRes } from './entities/favs.entity';
import { favsDb } from 'src/utils/db';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  getAll() {
    return this.favsService.getAll();
  }

  @Post(':resource/:id')
  add(@Param('resource') resource: string, @Param('id') id: string) {
    const resourceDb = favsDb[resource];
    if (!resourceDb) {
      throw new NotFoundException(`Path not found`);
    }
    const favsRes: IFavsRes = this.favsService.add(resourceDb, id);
    if (favsRes.code === 400) {
      throw new BadRequestException('Not valid fields');
    } else if (favsRes.code === 422) {
      throw new UnprocessableEntityException(favsRes.message);
    }
    return favsRes[resource];
  }

  @Delete(':resource/:id')
  @HttpCode(204)
  delete(@Param('resource') resource: string, @Param('id') id: string) {
    const resourceDb = favsDb[resource];
    if (!resourceDb) {
      throw new NotFoundException(`Path not found`);
    }
    const favsRes: IFavsRes = this.favsService.delete(resourceDb, id);
    if (favsRes.code === 400) {
      throw new BadRequestException('Not valid favs id');
    } else if (favsRes.code === 404) {
      throw new NotFoundException(`Favs with id ${id} not found`);
    }
  }
}
