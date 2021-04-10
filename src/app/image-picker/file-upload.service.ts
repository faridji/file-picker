import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FileUploadService 
{
    endpoint: string;
    constructor(private http: HttpClient) {
        this.endpoint = '/api/user_files/Upload';
    }

    upload(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        formData.append('UserFile', file);

        const req = new HttpRequest('POST', this.endpoint, formData, {
            reportProgress: true,
            responseType: 'json'
        });

        return this.http.request(req);
    }
}