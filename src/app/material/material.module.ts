import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
	  MatDialogModule,
    MatIconModule,

    FlexLayoutModule
  ],
  exports: [
    MatButtonModule,
	  MatDialogModule,
    MatIconModule,

    FlexLayoutModule
  ]
})
export class MaterialModule { }
