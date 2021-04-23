import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { FileUploadService } from './file-upload.service';
import { CustomFile, FileDimensions } from './models';


@Component({
  selector: 'chi-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit 
{
	@Input() type: 'image' | 'file';
	@Input() allowMultiple: boolean;
	@Input() allowedFileTypes: string[];
	@Input() maxFileSize: number; 		// Size in MBs
	@Input() dimension: FileDimensions;
	@Input() files: CustomFile[];
	@Input() showUploadedFiles: boolean;

	@ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
	@Output() selected: EventEmitter<CustomFile>;

	inDialog: boolean;
	private currentUploadRequest: Subscription;
	showRemoveBtn: boolean;
	showDetails: boolean;
	hoveredFile: CustomFile;

	constructor(private fileUploadService: FileUploadService) 
	{
		this.type = 'image';
		this.files = [];
		this.allowedFileTypes = [];
		this.files = [];
		this.currentUploadRequest = new Subscription();
		this.selected = new EventEmitter();

		this.inDialog = false;
		this.allowMultiple = true;
		this.showUploadedFiles = true;
		this.showRemoveBtn = false;
		this.showDetails = false;
		this.hoveredFile = null;
	}

  	ngOnInit(): void 
	{
		if (this.allowedFileTypes.length > 0) {
			const allowedFiles = [];
			for (let type of this.allowedFileTypes) allowedFiles.push('.' + type);
			this.allowedFileTypes = allowedFiles;
		}
  	}

	ngOnDestroy(): void
	{
		this.clearSubscription();	
	}

	clearSubscription(): void
	{
		if (this.currentUploadRequest) {
			this.currentUploadRequest.unsubscribe();
			this.currentUploadRequest = null;
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
			for (let i=0; i<files.length; i++) 
			{
				const file = files.item(i);
				const f = {
					file_name: file.name, 
					file_url: '/assets/no-image.svg', 
					progress_value: 0, 
					file_size: null,
					error_message: null
				};
				
				// remove file that has error if exists;
				const fileWithError = this.files.find(file => file.error_message != null);
				if (fileWithError) this.files.pop();
			
				this.files.push(f);

				// Check if current uploaded file has extension that is available in allowed file types;
				if (!this.isValidFileType(file)) 
				{
					f.error_message = `Invalid File Type. Allowed types are ${this.allowedFileTypes}`;
					return;
				}

				this.checkImageDimensions(file, f);
			}
		}
	}

	private isValidFileType(file: File): boolean
	{
		if (this.allowedFileTypes.length > 0)
    		return (new RegExp('(' + this.allowedFileTypes.join('|').replace(/\./g, '\\.') + ')$')).test(file.name.toLowerCase());
		
		return true;
	}

	private checkImageDimensions(file: File, f: CustomFile): void
	{
		let _URL = window.URL || window.webkitURL;
		const img = new Image();
		img.src = _URL.createObjectURL(file);

		if (this.dimension)
		{
			img.onload = () => {
				if (img.width > this.dimension.width || img.height > this.dimension.height) 
				{
					console.error('Invalid File Dimensions.');
					f.error_message = "Invalid dimensions!";
					return;
				}
				else 
				{
					this.checkImageSize(file, f);
				}
			}
		}
		else {
			this.checkImageSize(file, f);
		}
	}

	private checkImageSize(file: File, f: CustomFile): void
	{
		const sizeInMbs = Math.round(file.size/1024/1024);
		if (sizeInMbs > this.maxFileSize) {
			f.error_message = `File is too big (${sizeInMbs} MB). Max file size: ${this.maxFileSize}MB`;
			return;
		};

		this.upload(file, f);
	}

	private upload(file: File, f: CustomFile): void
	{
		this.currentUploadRequest = this.fileUploadService.upload(file).subscribe(
			(event: HttpEvent<any>) => {
				if (event.type === HttpEventType.UploadProgress) {
					f.progress_value = Math.round(100 * event.loaded / event.total);
				}
				else if (event instanceof HttpResponse) {
					f.file_url = event.body.data['file_url'];
					f.file_size = this.getImageSize(event.body.data)
					this.selected.emit(f);
					f.progress_value = 0;
				}
			},
			err => {
				f.progress_value = 0;
				f.error_message = `Could't upload file ${file.name}`;
			}
		);
	}

	private getImageSize(file: any): string
	{
		if (file['file_size'] < 10000) {
			return (file['file_size'] / 1024).toFixed(1) + ' KB';
		}
		else
		{
			return (file['file_size'] / (1024 * 1024)).toFixed(1) + ' MB';
		}
	}

	onRemoveFile(file: CustomFile): void
	{
		if (this.fileUploadService) this.clearSubscription();

		const idx = this.files.indexOf(file);
		this.files.splice(idx, 1);
	}

	onImageAreaLeave(file: CustomFile): void
	{
		this.showRemoveBtn = false; 
		this.showDetails = false;
		this.hoveredFile = null;
	}

	onImageAreaEnter(file: any): void
	{
		this.showRemoveBtn = true; 
		this.showDetails = true;
		this.hoveredFile = file;
	}

	onSave(): void
	{

	}

	fileHasError(): boolean
	{
		let hasError = false;
		for (let file of this.files)
		{
			if (file.error_message) hasError = true;
		}

		return hasError;
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

	get disableSaveBtn(): boolean
	{
		if (this.files.length === 0 || this.fileHasError()) 
		{
			return true;
		}

		return false;
	}
}
