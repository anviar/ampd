import { Component, OnInit } from '@angular/core';
import {AlbumService} from "../shared/services/album.service";
import {Album} from "../shared/models/album";
import {Observable} from "rxjs";

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent  {
  albums : Observable<Album[]>;

  constructor(private albumService : AlbumService) {
    this.albums = albumService.getAlbums();
  }


}
