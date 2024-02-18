import { Controller, Get, Post, Body, Patch, Param, Delete, Res, BadRequestException, NotFoundException, ForbiddenException, Put, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { response } from 'express';
import { IUserRes } from './entities/user.entity';
import { classToPlain, instanceToPlain, serialize } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  getAll() {
    return this.userService.getAll();
  }
  
  @Get(':id')
  getOne(@Param('id') id: string) {
    const userRes: IUserRes = this.userService.getOne(id);
    if (userRes.code === 400) {
      throw new BadRequestException('Invalid user id');
    } else if ((userRes.code === 404)) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return userRes.user;
  }
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const userRes: IUserRes = this.userService.create(createUserDto);
    if (userRes.code === 400) {
      throw new BadRequestException('Incorrect users fields');
    }
    return userRes.user;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userRes: IUserRes = this.userService.update(id, updateUserDto);
    if (userRes.code === 400) {
      throw new BadRequestException('Invalid user id');
    } else if ((userRes.code === 404)) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else if ((userRes.code === 403)) {
      throw new ForbiddenException(`Not correct password!`);
    }
    return userRes.user;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    const userRes: IUserRes = this.userService.delete(id);
    if (userRes.code === 400) {
      throw new BadRequestException('Invalid user id');
    } else if ((userRes.code === 404)) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    //return null;
  }
}
