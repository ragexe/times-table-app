/* eslint-disable no-plusplus -- Draft */ 
/* eslint-disable @typescript-eslint/no-magic-numbers -- Draft */ 
/* eslint-disable @typescript-eslint/explicit-function-return-type -- Draft */ 
import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  num1 = 0;
  num2 = 0;
  options: number[] = [];
  score = 0;
  message = 'Готов?'; // "Ready?"

  ngOnInit() {
    this.generateQuestion();
  }

  generateQuestion() {
    this.num1 = Math.floor(Math.random() * 8) + 2; // от 2 до 9
    this.num2 = Math.floor(Math.random() * 8) + 2;
    const correct = this.num1 * this.num2;

    // Генерируем 3 случайных ответа рядом с правильным
    const set = new Set<number>([correct]);

    while (set.size < 4) {
      const wrong = correct + (Math.floor(Math.random() * 10) - 5);
      if (wrong > 0) set.add(wrong);
    }
    this.options = Array.from(set).sort(() => Math.random() - 0.5);
  }

  checkAnswer(chosen: number) {
    if (chosen === this.num1 * this.num2) {
      this.score++;
      const positiveMessages = ['Супер!', 'Верно!', 'Молодец!', 'Круто!', 'Так держать!'];
      this.message = `✅ ${  positiveMessages[Math.floor(Math.random() * positiveMessages.length)]}`;

      setTimeout(() => {
        this.message = 'Следующий пример:';
        this.generateQuestion();
      }, 1000);
    } else {
      this.message = '❌ Ой, попробуй ещё раз!';
    }
  }
}
