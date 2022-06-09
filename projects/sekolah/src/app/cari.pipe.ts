import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cari'
})
export class CariPipe implements PipeTransform {

  transform(value: Array<any>, args: any, obj:string): any {

    if(value && args)
      return value.filter((a:any)=>{return a[obj] ? a[obj].toLowerCase().indexOf(args.toLowerCase()) > -1 : null});

      return value

  }

}
