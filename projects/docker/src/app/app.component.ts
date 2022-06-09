import { Component, ChangeDetectorRef } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import {Subject, Observable} from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'docker';
  qrcode: string = 'null';
  information:string = 'null'
  scannerEnabled: boolean = true;
  webcamImage:WebcamImage | undefined
  trigger: Subject<void> = new Subject<void>()

  constructor( private cd: ChangeDetectorRef){}

  triggerSnapshot(): void {
    this.trigger.next();
   }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
      alert('Kamera harus di izinkan nyala')
    }
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
   }

  handleImage(webcamImage: WebcamImage): void {
    // console.info('Saved webcam image', webcamImage);
    console.log(webcamImage.imageAsDataUrl);

    this.webcamImage = webcamImage;
   }


// scanSuccessHandler($event: any) {
//     console.log($event.target);

//   }

//   enableScanner() {
//     this.scannerEnabled = !this.scannerEnabled;
//     this.information = "No se ha detectado información de ningún código. Acerque un código QR para escanear.";
//   }

}

