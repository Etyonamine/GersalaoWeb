import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { UploadLogo } from './upload-logo';

@Injectable({
  providedIn: 'root'
})
export class UploadLogoService extends BaseService<UploadLogo>{

  // API url
  baseApiUrl = `${environment.API}UploadLogo`;
    
  constructor(protected http:HttpClient) {
    super(http,`${environment.API}UploadLogo`);
  }
  
  // Returns an observable
  upload(file):Observable<any> {
  
      // Create form data
      const formData = new FormData(); 
        
      // Store form name as "file" with file data
      formData.append("file", file, file.name);
        
      // Make http post request over api
      // with formData as req
      return this.http.post(this.baseApiUrl, formData)
  }
}
