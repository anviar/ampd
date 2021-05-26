import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorMsg } from "../error/error-msg";

@Injectable({
  providedIn: "root",
})
export class GenresService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  listAll(): Observable<String[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/genres/`;
    return this.http.get<String[]>(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError({
          title: `Got an error while retrieving genres`,
          detail: err.message,
        } as ErrorMsg)
      )
    );
  }
}
