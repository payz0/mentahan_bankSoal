import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizehtml'
})
export class SanitizehtmlPipe implements PipeTransform {

  constructor(private _sanitizer:DomSanitizer) {
  }

  transform(value: string): SafeHtml {
    if(!value)return ''
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }

}
