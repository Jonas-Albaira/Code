// @ts-ignore
import { Component, ViewEncapsulation } from '@angular/core';
// @ts-ignore
import { CommonModule } from '@angular/common';

// @ts-ignore
@Component({
  standalone: true,
  selector: 'app-nx-welcome',
  imports: [CommonModule],
  template: `
    <!--
     * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     This is a starter component and can be deleted.
     * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     Delete this file and get started with your project!
     * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     -->
    <!-- your giant HTML content stays the same -->
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcome {}
