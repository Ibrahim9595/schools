import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  @Input('data') data: any;
  @Input('options') options: any; 
  @Output('save') saved = new EventEmitter();

  errors = {
    required: 'This field is required',
    pattern: 'the pattern you entered is invalid',
    maxlength: 'you exceeded the max length',
    minlength: 'your input should be at least'
  };

  newModel = {};
  newOptions = {};
  keys = [];
  matchValid = true;
  fileUploading = false;
  uploadDone = false;
  uploadError = false;

  constructor(private http: Http) { }

  ngOnInit() {
    this.buildNewModel();
  }

  buildNewModel() {
    let recursiveKey = (data, options, parentTrace) => {
      for (let i in data) {
        if (typeof (data[i]) == 'object') {
          recursiveKey(data[i], options[i], parentTrace + i + '.');
        } else {
          this.newModel[parentTrace + i] = data[i];
          this.newOptions[parentTrace + i] = options[i];
          this.keys.push(parentTrace + i);
        }
      }
    }
    recursiveKey(this.data, this.options, '');
  }

  getKeys(obj) {
    let keys = [];
    
    for(let key in obj){
      keys.push(key);
    }

    return keys;
  }

  matchCheck(key, matchKey) {
    this.matchValid = this.newModel[key] === this.newModel[matchKey];
    return this.matchValid;
  }

  upload(file, key){

    this.fileUploading = true;
    setTimeout(()=>{
       let formData = new FormData();
    formData.append('file', file);
    this.http.post(this.newOptions[key].endPointOptions.url, formData)
    .map(data => data.json())
    .subscribe((data:any) => {
      this.newModel[key] = data[this.newOptions[key].endPointOptions.key];
      this.uploadDone = true;
      this.fileUploading=false;
    },err=>console.log(err));
    },2000)
   
    
  }

  save() {
  
    for(let tempKeys in this.newModel){
      let keys = tempKeys.split('.');
      let lastKey = keys.pop();
      let val = this.data;
      
      for(let key of keys) 
        val = val[key];

      val[lastKey] = this.newModel[tempKeys];
    }

    this.saved.emit(this.data);
  }
}
