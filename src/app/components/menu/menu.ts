import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatsService } from '../../services/stats';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
      @if (!statsService.isLoggedIn()) {
        <div class="flex flex-col gap-4">
          <input
            #nameInput
            type="text"
            placeholder="Как тебя зовут?"
            class="p-4 rounded-xl border-2 border-blue-400 outline-none text-2xl"
          />
          <button
            (click)="statsService.setUserName(nameInput.value)"
            class="bg-blue-500 text-white p-4 rounded-xl font-bold"
          >
            Начать заниматься!
          </button>
        </div>
      } @else {
        <h1 class="text-4xl font-bold text-blue-600 mb-10 text-center">Таблица умножения</h1>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
          @for (num of tables; track num) {
            <button
              [routerLink]="['/game', num]"
              class="w-24 h-24 text-3xl font-black rounded-full bg-yellow-400 text-white shadow-xl hover:bg-yellow-500 transition-all active:scale-90 border-4 border-yellow-200"
            >
              {{ num }}
            </button>
          }
        </div>

        <button
          [routerLink]="['/challenge', 'random']"
          class="mt-12 px-10 py-5 text-2xl font-bold bg-green-500 text-white rounded-2xl shadow-lg hover:bg-green-600 transition-all"
        >
          🎲 Вразнобой
        </button>
      }
    </div>
  `,
})
export class MenuComponent {
  // Available tables to practice
  protected tables = [2, 3, 4, 5, 6, 7, 8, 9];
  protected readonly statsService = inject(StatsService);
}
