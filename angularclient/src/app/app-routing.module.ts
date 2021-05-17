import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrowseComponent } from "./browse/browse.component";
import { QueueComponent } from "./queue/queue.component";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";
import {AlbumComponent} from "./album/album.component";

const routes: Routes = [
  { path: "", component: QueueComponent },
  { path: "albums", component: AlbumComponent },
  { path: "browse", component: BrowseComponent },
  { path: "search", component: SearchComponent },
  { path: "settings", component: SettingsComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
