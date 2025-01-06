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
  originalText: string = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque consectetur nemo saepe impedit ea'; // Reference text
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
  accuracy: number = 0; // Accuracy percentage

  currentKey: any = ''; // Current pressed key
  lastKey: string = ''; // Last key pressed
  isCapsLockOn: boolean = false;
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
  }

  handleKeyPress(key: string): void {
    this.currentKey = key;
    setTimeout(() => (this.currentKey = ''), 200);

    if (this.isCapsLockOn) {
      key = key.toUpperCase();
    }

    if (key === 'del') {
      this.typedText = this.typedText.slice(0, -1);
    } else if (key === ' ') {
      this.typedText += ' ';
    } else {
      this.typedText += key;
    }

    this.onType();
  }

  handleSpecialKeyPress(key: string): void {
    switch (key) {
      case 'CapsLock':
        this.toggleCapsLock();
        break;
      case 'Enter':
        this.handleEnterKey();
        break;
      case 'Shift':
        this.handleShiftKey();
        break;
      case 'Control':
        this.handleControlKey();
        break;
      case 'Tab':
        this.handleTabKey();
        break;
      default:
        break;
    }
  }

  toggleCapsLock(): void {
    this.isCapsLockOn = !this.isCapsLockOn;
  }

  handleEnterKey(): void {
    this.typedText += '\n';
    this.onType();
  }

  handleShiftKey(): void {
    // Handle Shift key functionality if needed
  }

  handleControlKey(): void {
    // Handle Control key functionality if needed
  }

  handleTabKey(): void {
    // Prevent default tab behavior
    this.typedText += '\t';
    this.onType();
  }

  onType(): void {
    if (!this.timerStarted) {
      this.startTimer(); // Start timer on first keypress
    }
    if (!this.timerStarted) {
      this.startTimer(); // Start timer on first keypress
    }

    const typed = this.typedText.split(''); // Split typed text into characters
    const original = this.originalText.split(''); // Split original text into characters

    this.correctWords = 0; // Reset correct words
    this.incorrectLetters = 0; // Reset incorrect letters

    let correctChars = 0; // Count of correct characters for accuracy

    // Iterate through typed characters
    typed.forEach((typedWord, wordIndex) => {
      const originalWord = original[wordIndex]; // Corresponding character in the original text

      if (typedWord === originalWord) {
        this.correctWords++; // Increment correctChars by 1 for each correct character
      } else {
        this.incorrectLetters++; // Count incorrect characters
      }
    });
    

    // Accuracy Calculation: (Correct characters / Total typed characters) * 100
    this.accuracy = typed.length
      ? Math.floor((correctChars / typed.length) * 100)
      : 0;

    // Words per minute Calculation: Words typed / (Elapsed time in minutes)
    const wordsTyped = this.typedText.trim().split(/\s+/).length;
    const elapsedMinutes = this.timer / 60;
    this.wpm = elapsedMinutes > 0 ? Math.floor(wordsTyped / elapsedMinutes) : 0;
  }
  

  startTimer(): void {
    this.timerStarted = true;
    this.interval = setInterval(() => {
      this.timer++;
      this.calculateWPM();
    }, 1000);
  }

  calculateWPM(): void {
    const wordsTyped = this.typedText.trim().split(/\s+/).length;
    const elapsedMinutes = this.timer / 60;
    this.wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
  }

  backspacefunc(): void {
    this.typedText = this.typedText.slice(0, -1);
  }

  othermodeon = false;
  othermode() {
    this.othermodeon = !this.othermodeon;
  }

  symbolsmodeon = false;
  symbolsmode() {
    this.symbolsmodeon = !this.symbolsmodeon;
  }
}