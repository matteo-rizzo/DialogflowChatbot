import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChatService } from './services/chat.service';
import { PusherService } from './services/pusher.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDetailsComponent } from './my-details/my-details.component';
import { ChatComponent } from './chat/chat.component';
import { RecordRtcComponent } from './record-rtc/record-rtc.component';

@NgModule({
  declarations: [
    AppComponent,
    MyDetailsComponent,
    ChatComponent,
    RecordRtcComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ChatService, PusherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
