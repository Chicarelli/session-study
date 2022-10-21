import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private array: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private readonly hardcodedPassword = '1234';

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

  executeLogin(user: sessionInfo, positions: string[]): any {
    const generatedKeyboard = user.teclas;

    const pressedKeys: string[][] = positions.map(
      (position: string) => generatedKeyboard[position],
    );

    const generatedPossibilities = this.generatePossibilities(pressedKeys);

    if (generatedPossibilities.includes(this.hardcodedPassword)) {
      return { message: 'Usuário Logado' };
    }

    throw new Error('Usuário não logado');
  }

  private generatePossibilities(pressedKeys: string[][]) {
    const possibilities: string[] = [];
    for (let firstPosition = 0; firstPosition <= 1; firstPosition++) {
      for (let secondPosition = 0; secondPosition <= 1; secondPosition++) {
        for (let thirdPosition = 0; thirdPosition <= 1; thirdPosition++) {
          for (let fourthPosition = 0; fourthPosition <= 0; fourthPosition++) {
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
