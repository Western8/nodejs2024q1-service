import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRes } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    //throw new Error('Craasssh!!!!!');
    const userRes = await this.userService.getOne(id);
    if (userRes.code === 400) {
      throw new BadRequestException('Invalid user id');
    } else if (userRes.code === 404) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return userRes.user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userRes = await this.userService.create(createUserDto);
    if (userRes.code === 400) {
      throw new BadRequestException('Incorrect users fields');
    }
    return userRes.user;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userRes = await this.userService.update(id, updateUserDto);
    if (userRes.code === 400) {
      throw new BadRequestException(userRes.message);
    } else if (userRes.code === 404) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else if (userRes.code === 403) {
      throw new ForbiddenException(`Not correct password!`);
    }
    return userRes.user;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const userRes: IUserRes = await this.userService.delete(id);
    if (userRes.code === 400) {
      throw new BadRequestException('Invalid user id');
    } else if (userRes.code === 404) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    //return null;
  }
}
