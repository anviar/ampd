import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorMsg } from "../error/error-msg";
import { Track } from "../messages/incoming/track";

@Injectable({
  providedIn: "root",
})
export class GenresService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.apiUrl = `${this.settingsService.getBackendContextAddr()}api/genres/`;
  }

  listAll(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError({
          title: `Got an error while retrieving genres`,
          detail: err.message,
        } as ErrorMsg)
      )
    );
  }

  getWords(genre: string): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/filter?genre=${genre}`).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError({
          title: `Got an error while retrieving tracks for genre: ${genre}`,
          detail: err.message,
        } as ErrorMsg)
      )
    );
  }
}
