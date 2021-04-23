import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagePickerComponent } from './image-picker/image-picker.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
	title = 'Image Picker Demo';

	constructor(private dialog: MatDialog) {}
	
	openImagePicker(): void
	{
		const dialog = this.dialog.open(ImagePickerComponent, {
			width: '50vw',
			height: '80vh',
			panelClass: 'chi-image-picker'
		});

		dialog.componentInstance.inDialog = true;
		dialog.componentInstance.type = 'image';
		dialog.componentInstance.allowMultiple = false;
		dialog.componentInstance.allowedFileTypes = ['png', 'jpg', 'jpeg'];
	}
}
