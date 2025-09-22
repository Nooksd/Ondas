import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ui',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './ui.html',
  styleUrl: './ui.scss',
})
export class Ui {}
