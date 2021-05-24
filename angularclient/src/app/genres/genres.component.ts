import {Component} from "@angular/core";
import {GenresService} from "../shared/services/genres.service";
import {Observable, of} from "rxjs";
import {ErrorMsg} from "../shared/error/error-msg";
import {MatChip} from "@angular/material/chips";

@Component({
  selector: "app-genres",
  templateUrl: "./genres.component.html",
  styleUrls: ["./genres.component.scss"],
})
export class GenresComponent {
  error: ErrorMsg | null = null;
  genres: Observable<String[]> | null = null;
  selected = new Set();

  constructor(private genresService: GenresService) {
    genresService.listAll().subscribe(
        (genres: String[]) => {
          this.genres = of(genres);
        },
        (err: ErrorMsg) => {
          this.error = err;
        }
    );
  }

  onChange(genre: String) {
    console.log("genre", genre)
    this.selected.add(genre);
  }
}
