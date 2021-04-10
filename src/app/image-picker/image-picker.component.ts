import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { FileProgress } from './models';


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
	files: FileProgress[];
	message: string;

	constructor(private fileUploadService: FileUploadService) 
	{
		this.type = 'image';
		this.files = [];
		this.allowMultiple = true;
		this.allowedFileTypes = ['images/*'];
		this.files = [];
		this.message = null;
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
				this.upload(i, files.item(i));
			}
		}
	}

	upload(idx: number, file: File): void
	{
		this.files[idx] = {progress: 0, fileName: file.name, url: '/assets/images/no-image.svg'};
		
		this.fileUploadService.upload(file).subscribe(
			(event: HttpEvent<any>) => {
				if (event.type === HttpEventType.UploadProgress) {
					this.files[idx].progress = Math.round(100 * event.loaded / event.total);
					console.log('Progress =', this.files[idx]);
				}
				else if (event instanceof HttpResponse) {
					this.files[idx].url = event.body.data['file_url'];
				}
			},
			err => {
				this.files[idx].progress = 0;
				this.message = `Could't upload file ${file.name}`;
			}
		);
	}

	onRemoveFile(file: FileProgress): void
	{
		const idx = this.files.indexOf(file);
		this.files.splice(idx, 1);
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
