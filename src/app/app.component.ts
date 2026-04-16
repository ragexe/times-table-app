/* eslint-disable no-plusplus -- Draft */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Draft */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- Draft */
import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
})
export class AppComponent {}
