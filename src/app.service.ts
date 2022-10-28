import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { stringify } from 'querystring';
import { response } from 'express';

@Injectable()
export class AppService {
  private array: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private readonly hardcodedPassword = '1234';

  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  private shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  gerarTeclas(): string[][] {
    const array = this.array;
    this.shuffleArray(array);

    const teclas = [];

    for (let i = 0; i < 5; i++) {
      teclas.push(array.slice(i * 2, i * 2 + 2));
    }

    return teclas;
  }

  async executeLogin(user: sessionInfo, positions: string[]): Promise<any> {
    const generatedKeyboard = user.teclas;

    const pressedKeys: string[][] = positions.map(
      (position: string) => generatedKeyboard[position],
    );

    const generatedPossibilities = this.generatePossibilities(pressedKeys);

    console.log(
      'Fazer as requests de forma assincrona pra ver se alguma delas é a correta',
    );

    const body = {
      grant_type: 'password',
      client_id: 'nodejs-adapter-test',
      client_secret: 'QygjSIaz6iH4iGzlLZHhHCugSLJjRlMc',
      password: generatedPossibilities[0],
      username: 'rafael.chicarelli',
    };

    const values = [];
    await Promise.all(
      generatedPossibilities.map(async (password) => {
        return this.httpService
          .post(
            'http://localhost:8080/auth/realms/Another-realm/protocol/openid-connect/token',
            stringify({
              grant_type: 'password',
              client_id: 'nodejs-adapter-test',
              client_secret: 'QygjSIaz6iH4iGzlLZHhHCugSLJjRlMc',
              password: password,
              username: 'rafael.chicarelli',
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          )
          .pipe(map((response) => response))
          .toPromise()
          .then((value) => {
            values.push({
              error: false,
              access_token: value.data.access_token,
            });
          })
          .catch((error) => {
            values.push({ error: true });
          });
      }),
    );

    const success = values.filter((item) => !item?.error);
    console.log(values);

    return { success: success.length > 0 ? true : false, obj: success[0] };
  }

  private generatePossibilities(pressedKeys: string[][]) {
    const possibilities: string[] = [];
    for (let firstPosition = 0; firstPosition <= 1; firstPosition++) {
      for (let secondPosition = 0; secondPosition <= 1; secondPosition++) {
        for (let thirdPosition = 0; thirdPosition <= 1; thirdPosition++) {
          for (let fourthPosition = 0; fourthPosition <= 1; fourthPosition++) {
            const firstNumber = pressedKeys[0][firstPosition];
            const secondNumber = pressedKeys[1][secondPosition];
            const thirdNumber = pressedKeys[2][thirdPosition];
            const fourthNumber = pressedKeys[3][fourthPosition];

            possibilities.push(
              `${firstNumber}${secondNumber}${thirdNumber}${fourthNumber}`,
            );
          }
        }
      }
    }
    return possibilities;
  }
}

/**
 * [ ] - Receber posições de array preenchidas.
 * [ ] - Pegar as teclas da sessão salvas daquele usuário.
 * [ ] - Ver se a genha (1234) bate com as teclas escolhidas, através de geração de possibilidades.
 */
