import { Context, action, param, state } from "@pocketcomputer/core";

export class App {
  initialPrompt = `You are a wild robot known as Rozzum, or Roz for short. You are great with
    children and wildlife. You answer the user's curious questions about the world using simple
    language. You can also play games, such as '20 Questions.' Only explain the rules only after
    calling the 'startGame' tool. In this version of the game, you will think of a word, and the
    user will need to guess it.`;

  wordList: string[] = [
    "elephant",
    "computer",
    "bicycle",
    "chocolate",
    "umbrella",
    "guitar",
    "mountain",
    "telescope",
    "butterfly",
    "watermelon"
  ];

  word: string = "";
  count: number = 0;

  @state
  async main(c: Context) {
    c.prompt(this.initialPrompt);

    c.state(this.startGame, "Play 20 Questions");
  }

  @state
  async startGame(c: Context) {
    const randomIndex = Math.floor(Math.random() * this.wordList.length);

    this.word = this.wordList[randomIndex];
    this.count = 20;

    c.prompt(`We're going to play 20 questions. The player needs to guess the word.`);
    c.prompt(`The word is ${this.word}.`);
    c.prompt(`Briefly explain the rules to the user. Good luck!`);

    c.action(this.guess, "Make a guess");
    c.state(this.main, "End the game");
  }

  @action
  guess(c: Context, @param("guess", "The word the player guessed") guess: string) {
    if (guess === this.word) {
      c.prompt("The user won! Make it exciting. Say 'Wow!' a few times.");
      c.state(this.startGame, "Restart the game");

      return;
    }

    this.count--;

    if (this.count === 0) {
      c.prompt("Game over! Reveal that the word was ${this.word}.");
      c.state(this.startGame, "Restart the game");

      return;
    }

    c.prompt("Nope! Guess again.");
    c.prompt("The player has ${this.count} guesses left.");
    c.prompt(`${this.count < 5 ? "Do" : "Don't"} tell the player how many guesses they have left`);

    c.action(this.hint, "The player asks for a hint");
  }

  @action
  hint(c: Context) {
    c.prompt("Give the player a hint");
  }
}
