import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'typewriter';
  randomText: string =
    'This is a random paragraph for typing. Feel free to type it and see your typing stats.';
  typedText: string = '';
  typedWords: { word: string; isCorrect: boolean }[] = [];
  timeLeft: number = 60;
  timer: any;
  correctWords: number = 0;
  incorrectWords: number = 0;
  accuracy: number = 100;
  wpm: number = 0;

  ngOnInit(): void {
    this.startTimer();
  }

  onInput(): void {
    const typedWordsArray = this.typedText.trim().split(' ');
    const randomWordsArray = this.randomText.split(' ');

    this.correctWords = 0;
    this.incorrectWords = 0;

    // Compare each typed word with the corresponding random word
    this.typedWords = typedWordsArray.map((word, index) => {
      const isCorrect = word === randomWordsArray[index];
      if (isCorrect) {
        this.correctWords++;
      } else {
        this.incorrectWords++;
      }
      return { word, isCorrect };
    });

    this.updateStats();
  }

  updateStats(): void {
    const totalTyped = this.correctWords + this.incorrectWords;
    this.wpm = Math.round((this.correctWords / (60 - this.timeLeft)) * 60);
    this.accuracy = totalTyped > 0 ? Math.round((this.correctWords / totalTyped) * 100) : 100;
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }
}
