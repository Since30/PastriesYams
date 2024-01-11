import Dice1 from '../../assets/pictures/Dice/Dice-1.png';
import Dice2 from '../../assets/pictures/Dice/Dice-2.png';
import Dice3 from '../../assets/pictures/Dice/Dice-3.png';
import Dice4 from '../../assets/pictures/Dice/Dice-4.png';
import Dice5 from '../../assets/pictures/Dice/Dice-5.png';
import Dice6 from '../../assets/pictures/Dice/Dice-6.png';

export const getDiceImage = (value: number) => {
        switch (value) {
          case 1:
            return Dice1;
          case 2:
            return Dice2;
          case 3:
            return Dice3;
          case 4:
            return Dice4;
          case 5:
            return Dice5;
          case 6:
            return Dice6;
          default:
            return Dice1;
        }
      };

export const checkResult = (diceValues: number[]): string => {
    const counts: { [key: number]: number } = {};
  for (const value of diceValues) {
    counts[value] = (counts[value] || 0) + 1;
  }

  let hasPair = false;
  let hasThreeOfAKind = false;
  for (const count of Object.values(counts)) {
    if (count === 4) {
      return 'carre';
    } else if (count === 3) {
      hasThreeOfAKind = true;
    } else if (count === 2) {
      hasPair = true;
    }
  }

  if (hasThreeOfAKind) return 'brelan';
  if (hasPair) return 'paire';
  return 'Perdu';
};