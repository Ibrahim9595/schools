import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: [any], key: string, filter: string): any {
    if(!filter || !items.length){
      return items;
    }
    
    return items.filter((item)=>{
      return item[key].indexOf(filter) !== -1;
    });
  }

}
