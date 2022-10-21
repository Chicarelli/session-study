import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('/setSession')
  // getHello(@Req() request): any {
  //   request.session.set('userId', new Date().getTime().toString());

  //   return {
  //     message: 'userId setado',
  //   };
  // }

  // @Get('/getSession')
  // getSession(@Req() request): any {
  //   return { userId: request.session.get('userId') };
  // }

  // @Get('/deleteSession')
  // deleteSession(@Req() request): any {
  //   request.session.delete('userId');
  //   return { message: 'userId deleted' };
  // }

  @Post('/session/user-data')
  insertUserData(@Req() request, @Res() response, @Body() user): any {
    if (
      user.username.length === 0 ||
      user.account.length === 0 ||
      user.agency.length === 0
    ) {
      return response.status(404).send({ message: 'Invalid user data' });
    }
    request.session.set('userData', request.body);

    return response.status(302).redirect('/login.html');
  }

  @Get('/session/valid')
  checkValidSession(@Req() request, @Res() response) {
    const sessionUser = request.session.get('userData');
    if (!sessionUser) {
      return response.status(302).redirect('/');
    }
    return response.status(200).send(sessionUser);
  }

  /*
    [ ] - Guardar posições sortidas do Array na sessão do usuário.
    [ ] - Enviar array de teclas para o usuário. [1,2] [3,4] [5,7]...
  */
  @Get('/session/keypad')
  getKeyboard(@Req() request) {
    if (request.session.get('userData')) {
      const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      this.appService.shuffleArray(array);

      const teclas = [];

      for (let i = 0; i < 5; i++) {
        teclas.push(array.slice(i * 2, i * 2 + 2));
      }

      request.session.set({ ...request.session.get('userData'), teclas });

      return { teclas };
    }
  }
}
