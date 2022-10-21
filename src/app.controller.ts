import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/setSession')
  getHello(@Req() request): any {
    request.session.set('userId', new Date().getTime().toString());

    return {
      message: 'userId setado',
    };
  }

  @Get('/getSession')
  getSession(@Req() request): any {
    return { userId: request.session.get('userId') };
  }

  @Get('/deleteSession')
  deleteSession(@Req() request): any {
    request.session.delete('userId');
    return { message: 'userId deleted' };
  }
}
