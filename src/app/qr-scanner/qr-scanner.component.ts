import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss'
})
export class QrScannerComponent implements OnInit, OnDestroy{
  private codeReader!: BrowserMultiFormatReader;
  private selectedDeviceId: string | null = null;
  private videoElement: HTMLVideoElement | null = null;

  isStarted = false;
  error: string | null = null;
  hasMultipleCameras = false;
  result$ = new BehaviorSubject<string | null>(null);

  constructor() {
    // Configure hints to only look for QR codes
    const hints = new Map();
    hints.set('POSSIBLE_FORMATS', [BarcodeFormat.QR_CODE]);
    hints.set('TRY_HARDER', true);
    
    // Initialize the code reader with hints
    this.codeReader = new BrowserMultiFormatReader(hints);
  }

  async ngOnInit() {
    try {
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      this.hasMultipleCameras = videoInputDevices.length > 1;
      
      // Default to the environment-facing camera if available
      this.selectedDeviceId = videoInputDevices.find(
        device => device.label.toLowerCase().includes('back')
      )?.deviceId || videoInputDevices[0]?.deviceId;

      this.videoElement = document.getElementById('video') as HTMLVideoElement;
    } catch (err) {
      this.error = 'Failed to initialize camera';
      console.error('Error initializing QR scanner:', err);
    }
  }

  async toggleScanner() {
    if (this.isStarted) {
      await this.stopScanner();
    } else {
      await this.startScanner();
    }
  }

  private async startScanner() {
    try {
      if (!this.videoElement || !this.selectedDeviceId) {
        throw new Error('Video element or device not found');
      }

      this.error = null;
      this.isStarted = true;

      await this.codeReader.decodeFromVideoDevice(
        this.selectedDeviceId,
        this.videoElement,
        (result, error) => {
          if (result) {
            this.result$.next(result.getText());
            // Optional: Stop scanner after successful scan
            // this.stopScanner();
          }
          if (error && !(error instanceof TypeError)) {
            // TypeError is thrown when scanning is cancelled, we can ignore it
            console.error('QR scanning error:', error);
          }
        }
      );
    } catch (err) {
      this.error = 'Failed to start scanner';
      this.isStarted = false;
      console.error('Error starting QR scanner:', err);
    }
  }

  private async stopScanner() {
    try {
      // await this.codeReader.reset();
      this.isStarted = false;
      this.error = null;
    } catch (err) {
      console.error('Error stopping QR scanner:', err);
    }
  }

  async switchCamera() {
    const devices = await BrowserMultiFormatReader.listVideoInputDevices();
    const currentIndex = devices.findIndex(device => device.deviceId === this.selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    this.selectedDeviceId = devices[nextIndex].deviceId;

    if (this.isStarted) {
      await this.stopScanner();
      await this.startScanner();
    }
  }

  ngOnDestroy() {
    this.stopScanner();
  }
}
