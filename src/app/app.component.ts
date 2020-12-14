import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CSVRecord } from './CSVRecord';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  shippingPriceForm: FormGroup;
  csvRecords: any[] = [];  
  totalShippingCost: number;

  @ViewChild('csvReader') csvReader: any;  

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.shippingPriceForm = this.formBuilder.group({
      postCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      totalOrderAmount: [0, [Validators.pattern('^[0-9]*$'),]],   
      longProductFlag: [''], 
      file: ['', [Validators.required, Validators.pattern('.*\.csv$')]],
    });
  }
  
  uploadListener($event: any): void {  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.csvRecords = this.getRecordsFromCSVFile(csvRecordsArray, headersRow.length);  
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      this.fileReset();  
    }  
  }  
  
  onSubmit(): void {
    this.totalShippingCost = this.countTotalShippingCost();
  }

  private countTotalShippingCost(): number {
    let totalShippingCost: number = this.shippingPriceForm.get('totalOrderAmount').value;

    if(this.csvRecords) {
      const postCode = this.shippingPriceForm.get('postCode').value;
      const record: CSVRecord = this.csvRecords.find((c: CSVRecord) => c.id === postCode.substring(0,2));

      if(record) {
        totalShippingCost += Number(record.price);
      } else {
        alert("Provided .csv file doesn not contain entered postcode. Zone price cost will be count as 0.");  
      }
    }

    if(this.shippingPriceForm.get('longProductFlag').value) {
      totalShippingCost += 1995;
    }

    if(this.shippingPriceForm.get('totalOrderAmount').value > 12500) {
      totalShippingCost = 0.95*totalShippingCost;
    }

    return totalShippingCost;
  }

  private getRecordsFromCSVFile(csvRecordsArray: any, headerLength: any): CSVRecord[] {  
    let csvArr: CSVRecord[] = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let currentRecord = (<string>csvRecordsArray[i]).split(','); 

      if (currentRecord.length == headerLength) {  
        const csvRecord = new CSVRecord(currentRecord[0].trim(), currentRecord[1].trim());  

        csvArr.push(csvRecord);  
      }  
    }  

    return csvArr;  
  }  

  private getHeaderArray(csvRecordsArr: any): string[] {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray: string[] = []; 

    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  

    return headerArray;  
  }  

  private isValidCSVFile(file: any): boolean {  
    return file.name.endsWith(".csv");  
  }  

  private fileReset(): void {  
    this.csvReader.nativeElement.value = "";  
    this.csvRecords = [];  
  }  
}
