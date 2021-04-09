import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'chi-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit 
{
	@ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
	
	type: 'image' | 'file';
	allowMultiple: boolean;
	allowedFileTypes: string[];
	files: File[];

	constructor() 
	{
		this.type = 'image';
		this.files = [];
		this.allowMultiple = true;
		this.allowedFileTypes = ['images/*'];
	}

  	ngOnInit(): void 
	{
		if (this.allowedFileTypes.length > 0 || this.allowedFileTypes[0] !== 'images/*') {
			const allowedFiles = [];
			for (let type of this.allowedFileTypes) allowedFiles.push('.' + type);
			this.allowedFileTypes = allowedFiles;
		}
  	}

	onBrowseExistingFiles(): void
	{

	}

	onUploadFile(): void
	{
		this.fileInput.nativeElement.click();
	}
	
	onFileChange(): void
	{
		const files = this.fileInput.nativeElement.files;
		if (files) {
			for (let i=0; i<files.length; i++) {
				this.files.push(files.item(i));
			}
		}
		
		console.log('All Files =', this.files);
	}

	get title(): string
	{
		switch(this.type) {
			case 'image':
				return 'Image Picker';
			case 'file':
				return 'File Picker';
		}
	}
}
