import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadData(data:any) {
    let url = 'http://127.0.0.1:5000/api/upload';
    return this.http.post(url, data);
  }

  testGet() {
    let url = 'http://127.0.0.1:5000/api/upload';
    return this.http.get(url);
  }

}