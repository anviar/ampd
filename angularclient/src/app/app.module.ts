import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory,} from "@stomp/ng2-stompjs";
import {CoverModalComponent} from "src/app/shared/cover-modal/cover-modal.component";
import {AppComponent} from "./app.component";
import {BrowseComponent} from "./browse/browse.component";
import {DirectoriesComponent} from "./browse/directories/directories.component";
import {NavigationComponent} from "./browse/navigation/navigation.component";
import {PlaylistsComponent} from "./browse/playlists/playlists.component";
import {TracksComponent} from "./browse/tracks/tracks.component";
import {ControlPanelComponent} from "./queue/control-panel/control-panel.component";
import {MpdModesComponent} from "./queue/mpd-modes/mpd-modes.component";
import {QueueHeaderComponent} from "./queue/queue-header/queue-header.component";
import {QueueComponent} from "./queue/queue.component";
import {TrackProgressComponent} from "./queue/track-progress/track-progress.component";
import {TrackTableComponent} from "./queue/track-table/track-table.component";
import {VolumeSliderComponent} from "./queue/volume-slider/volume-slider.component";
import {SearchComponent} from "./search/search.component";
import {SettingsComponent} from "./settings/settings.component";
import {ConnectionConfigUtil} from "./shared/conn-conf/conn-conf-util";
import {EncodeURIComponentPipe} from "./shared/pipes/EncodeURI";
import {DirectoryFilterPipe} from "./shared/pipes/filter/DirectoryFilter";
import {MpdTrackFilterPipe} from "./shared/pipes/filter/MpdTrackFilter";
import {PlaylistFilterPipe} from "./shared/pipes/filter/PlaylistFilter";
import {SecondsToMmSsPipe} from "./shared/pipes/SecondsToMmSs";
import {AppRoutingModule} from "./app-routing.module";
import {BrowseService} from "./shared/services/browse.service";
import {MessageService} from "./shared/services/message.service";
import {NotificationService} from "./shared/services/notification.service";
import {WebSocketService} from "./shared/services/web-socket.service";
import {SharedModule} from "./shared/shared.module";
import {SecondsToHhMmSsPipe} from "./shared/pipes/SecondsToHhMmSs";
import {NavbarComponent} from './navbar/navbar.component';
import {DeviceDetectorModule} from "ngx-device-detector";

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    BrowseComponent,
    EncodeURIComponentPipe,
    SearchComponent,
    SecondsToMmSsPipe,
    SecondsToHhMmSsPipe,
    PlaylistFilterPipe,
    MpdTrackFilterPipe,
    DirectoryFilterPipe,
    SearchComponent,
    SettingsComponent,
    CoverModalComponent,
    DirectoriesComponent,
    PlaylistsComponent,
    TracksComponent,
    QueueHeaderComponent,
    ControlPanelComponent,
    TrackProgressComponent,
    VolumeSliderComponent,
    MpdModesComponent,
    TrackTableComponent,
    NavigationComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    FlexLayoutModule,
    DeviceDetectorModule
  ],
  providers: [
    BrowseService,
    MessageService,
    NotificationService,
    WebSocketService,
    {
      provide: InjectableRxStompConfig,
      useValue: AppModule.loadStompConfig(),
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
  ],
  entryComponents: [CoverModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  static loadStompConfig(): InjectableRxStompConfig {
    const myRxStompConfig: InjectableRxStompConfig = {
      // Which server?
      brokerURL: ConnectionConfigUtil.getWebSocketAddr(),

      // Headers
      // Typical keys: login, passcode, host
      connectHeaders: {},

      // How often to heartbeat?
      // Interval in milliseconds, set to 0 to disable
      heartbeatIncoming: 0, // Typical value 0 - disabled
      heartbeatOutgoing: 1000, // Typical value 20000 - every 20 seconds

      // Wait in milliseconds before attempting auto reconnect
      // Set to 0 to disable
      // Typical value 500 (500 milli seconds)
      reconnectDelay: 100,

      // Will log diagnostics on console
      // It can be quite verbose, not recommended in production
      // Skip this key to stop logging to console
      // debug: (msg: string): void => {
      //   console.log(new Date(), msg);
      // }
    };
    return myRxStompConfig;
  }
}
