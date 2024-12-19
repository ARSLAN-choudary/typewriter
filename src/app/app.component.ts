import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  typedText: string = ''; // User-typed text
  originalText: string = 'Type the text shown here correctly.'; // Reference text
  textOptions: any[] = [
    'Angular is awesome!',
    'Keep typing!',
    'Nice work!',
    'All done!',
  ];
  timerStarted: boolean = false; // Timer flag
  timer: number = 0; // Timer in seconds
  interval: any; // Timer interval

  correctWords: number = 0; // Correctly typed words
  incorrectLetters: number = 0; // Incorrectly typed letters
  wpm: number = 0; // Words per minute
  accuracy: number = 100; // Accuracy percentage

  currentKey: any = ''; // Current pressed key
  lastKey: string = ''; // Last key pressed
  private eventListener: (() => void) | undefined; // Keydown event listener

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.eventListener = this.renderer.listen(
      'window',
      'keydown',
      (event: KeyboardEvent) => {
        this.onKeyPress(event);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.eventListener) {
      this.eventListener(); // Remove event listener
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9\s]$/; // Allow only alphanumeric and space

    if (regex.test(event.key)) {
      this.currentKey = event.key;
      setTimeout(() => (this.currentKey = ''), 200);
      this.onType();
    }
  }
  onType(): void {
    if (!this.timerStarted) {
      this.startTimer(); // Start timer on first keypress
    }

    const typed = this.typedText.split(''); // Split typed text into characters
    const original = this.originalText.split(''); // Split original text into characters

    this.correctWords = 0; // Reset correct words
    this.incorrectLetters = 0; // Reset incorrect letters

    let currentWordIndex = 0;
    let currentWordCorrect = 0; // Correctly typed characters in the current word
    let correctChars = 0; // Count of correct characters for accuracy

    // Iterate through typed characters
    typed.forEach((char, index) => {
      const currentChar = original[index]; // Corresponding character in the original text

      if (char === currentChar) {
        correctChars++;
        currentWordCorrect++;
      } else {
        this.incorrectLetters++; // Count incorrect characters
      }

      // Check if a word is completed (space or last character)
      if (char === ' ' || index === typed.length - 1) {
        if (currentWordCorrect > 0) {
          this.correctWords++; // Increment correct words count if word is correctly typed
        }
        currentWordCorrect = 0; // Reset for next word
      }
    });

    // Accuracy Calculation: (Correct characters / Total typed characters) * 100
    this.accuracy = typed.length
      ? Math.floor((correctChars / typed.length) * 100)
      : 100;

    // Words per minute Calculation: Words typed / (Elapsed time in minutes)
    const wordsTyped = this.typedText.trim().split(/\s+/).length;
    const elapsedMinutes = this.timer / 60;
    this.wpm = elapsedMinutes > 0 ? Math.floor(wordsTyped / elapsedMinutes) : 0;
    let originalTextArr = this.originalText.split('');
    let typedTextArr = this.typedText.split('');

    if (originalTextArr.length === typedTextArr.length) {
      const newText = this.checkInput();
      this.getRandomText();
    }
  }

  checkInput() {
    if (this.typedText === this.originalText) {
      this.originalText = this.getRandomText();
      this.typedText = ''; // Input auto clear
    }
  }

  getRandomText() {
    const randomIndex = Math.floor(Math.random() * this.textOptions.length);
    return this.textOptions[randomIndex];
  }

  startTimer(): void {
    this.timerStarted = true;
    this.timer = 0; // Reset timer
    this.interval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.interval);
    this.timerStarted = false;
  }

  resetStats(): void {
    this.stopTimer();
    this.typedText = '';
    this.timer = 0;
    this.correctWords = 0;
    this.incorrectLetters = 0;
    this.wpm = 0;
    this.accuracy = 100;
  }

  handleKeyPress(key: any): void {
    this.currentKey = key;
    setTimeout(() => (this.currentKey = ''), 200);

    if (key === ' ') {
      this.typedText += ' ';
    } else {
      this.typedText += key;
    }

    this.onType();
  }
}
