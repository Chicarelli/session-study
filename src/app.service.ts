import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { stringify } from 'querystring';

@Injectable()
export class AppService {
  private array: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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

    const values = [];
    await Promise.all(
      generatedPossibilities.map(async (password) => {
        return this.httpService
          .post(
            process.env.KEYCLOAK_CLIENT_TOKEN_URL,
            stringify(this.createBodyLogin(password)),
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

  private createBodyLogin(password: string): LoginKeycloak {
    return {
      password,
      grant_type: process.env.KEYCLOAK_GRANT_TYPE,
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      username: 'rafael.chicarelli',
    };
  }
}
