import {Component, OnInit} from "@angular/core";
import {GenresService} from "../shared/services/genres.service";
import {Observable, of} from "rxjs";
import {ErrorMsg} from "../shared/error/error-msg";
import {catchError} from "rxjs/operators";

@Component({
  selector: "app-genres",
  templateUrl: "./genres.component.html",
  styleUrls: ["./genres.component.scss"],
})
export class GenresComponent implements OnInit {
  error: Observable<ErrorMsg> | null = null;
  genres: Observable<String[]> | null = null;

  constructor(private genresService: GenresService) {
    this.genres = genresService.listAll();
  }

  ngOnInit() {
    if (this.genres) {
      this.genres.pipe(
          catchError((err: ErrorMsg) => {
            console.log("LOL")
            this.error = of(err);
            debugger
            return of([]);
          })
      );
    }
  }
}
