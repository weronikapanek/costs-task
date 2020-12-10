import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getMatIconNameNotFoundError } from '@angular/material/icon';


@Injectable({
  providedIn: 'root'
})
export class CsvfileService {


  data = 'https://files.fm/u/28qej5k2n#/view/2zx2nukmr'
  constructor(private http: HttpClient) { 

  }
}
