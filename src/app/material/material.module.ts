import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
	  MatDialogModule,
    MatIconModule,
    MatProgressBarModule,

    FlexLayoutModule
  ],
  exports: [
    MatButtonModule,
	  MatDialogModule,
    MatIconModule,
    MatProgressBarModule,

    FlexLayoutModule
  ]
})
export class MaterialModule { }
