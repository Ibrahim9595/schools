import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';

@Pipe({
  name: 'find',
  pure: false
})
export class FindPipe implements PipeTransform {

  transform(filteredArr: any[], filterArr: any[], key: string): any[] {
    if(!filteredArr || !filterArr)
      return [];
    
    let ret = [];
    let options = {};
    for(let fa of filteredArr){
      options[key] = fa[key];
      let found = find(filterArr, options);
      
      if(!found){
        ret.push(fa);
      }
    }

    return ret;
  }

}
