import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

  @Get('/session/keypad')
  getKeyboard(@Req() request) {
    if (request.session.get('userData')) {
      const teclas = this.appService.gerarTeclas();

      request.session.set('userData', {
        ...request.session.get('userData'),
        teclas,
      });

      return { teclas };
    }
  }

  @Post('/session/logar')
  login(@Req() request, @Body() body: LogarDTO, @Res() response) {
    try {
      const positions: string[] = body.positions.split('');
      const user: sessionInfo = request.session.get('userData');
      const result = this.appService.executeLogin(user, positions);
      request.session.delete();
      return response.status(200).send(result);
    } catch (error) {
      return response.status(400).send({ message: error.message, error: true });
    }
  }
}
