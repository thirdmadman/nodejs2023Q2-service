import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { throwException } from 'src/utils/helpers';
import { RefreshDto } from './dto/refresh.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() authDTO: AuthDto) {
    const resultObj = await this.authService.signUp(authDTO);
    if (!resultObj) {
      throw new InternalServerErrorException();
    }

    if (resultObj.isError) {
      throw new NotAcceptableException(resultObj.error);
    }

    return resultObj.entity;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() authDTO: AuthDto) {
    const result = await this.authService.signIn(authDTO);
    return result ?? throwException(new ForbiddenException());
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: Request, @Body() refreshDTO: RefreshDto) {
    const result = await this.authService.refresh(req, refreshDTO);
    return result ?? throwException(new ForbiddenException());
  }
}
