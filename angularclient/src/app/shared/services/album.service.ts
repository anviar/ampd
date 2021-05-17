import {Injectable} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorMsg} from "../error/error-msg";
import {ServerStatistics} from "../models/server-statistics";
import {SettingsService} from "./settings.service";
import {Album} from "../models/album";

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private http: HttpClient, private settingsService: SettingsService) {
  }

  getAlbums(): Observable<Album[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/albums`;
    return this.http.get<Album[]>(url).pipe(
        catchError((err: HttpErrorResponse) =>
            throwError({
              title: `Got an error retrieving albums:`,
              detail: err.message,
            } as ErrorMsg)
        )
    );
  }
}
