import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, PatternValidator, Validators} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'form';
  options: FormGroup;

  constructor(private FormBuilder: FormBuilder) { }
  ngOnInit() {
    this.options = this.FormBuilder.group({
      hideRequired: [''],
      finalValue: ['', Validators.required],
      postCode: ['', [ Validators.required, Validators.pattern('[0-9]{5}'), Validators.maxLength(5), Validators.minLength(5)]]
    });
  }
}
