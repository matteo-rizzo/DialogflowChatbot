import { Component, OnInit} from '@angular/core';
import { RecordRTC } from 'recordrtc/RecordRTC.min';

@Component({
  selector: 'app-record-rtc',
  templateUrl: './record-rtc.component.html',
  styleUrls: ['./record-rtc.component.css']
})
export class RecordRtcComponent {

  private stream: MediaStream;
  private recordRTC: any;

  constructor() {
    // Do stuff here
  }

  successCallback(stream: MediaStream) {
    const options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
  }

  errorCallback() {
    // Handle error here
  }

  startRecording() {
    const mediaConstraints = {audio: true};
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopRecording() {
    const stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
  }

  download() {
    this.recordRTC.save('video.webm');
  }
}
