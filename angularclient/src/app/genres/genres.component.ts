import { Component } from "@angular/core";
import { GenresService } from "../shared/services/genres.service";
import { Observable, of } from "rxjs";
import { ErrorMsg } from "../shared/error/error-msg";
import { TrackTableData } from "../shared/track-table/track-table-data";
import { ClickActions } from "../shared/track-table/click-actions.enum";
import { MatTableDataSource } from "@angular/material/table";
import { QueueTrack } from "../shared/models/queue-track";

@Component({
  selector: "app-genres",
  templateUrl: "./genres.component.html",
  styleUrls: ["./genres.component.scss"],
})
export class GenresComponent {
  dataSource = new MatTableDataSource<QueueTrack>([]);
  error: ErrorMsg | null = null;
  genres: Observable<string[]> | null = null;
  isMobile = false;
  selected: string = "";
  trackTableData = new TrackTableData();

  constructor(private genresService: GenresService) {
    genresService.listAll().subscribe(
      (genres: string[]) => {
        this.genres = of(genres);
      },
      (err: ErrorMsg) => {
        this.error = err;
      }
    );
  }

  onChange(genre: string) {
    this.selected = genre;
    this.genresService.getWords(genre).subscribe((tracks) => {
      const tableData = tracks.map(
        (track, index) => new QueueTrack(track, index)
      );
      this.dataSource = new MatTableDataSource<QueueTrack>(tableData);
      this.trackTableData = this.buildTableData();
    });
  }

  private buildTableData(): TrackTableData {
    const trackTable = new TrackTableData();
    trackTable.addTitleColumn = true;
    trackTable.clickable = true;
    trackTable.dataSource = this.dataSource;
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.notify = true;
    trackTable.pagination = true;
    trackTable.playTitleColumn = true;
    trackTable.sortable = true;
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "playTitle", showMobile: true },
      { name: "addTitle", showMobile: true },
    ];
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}
