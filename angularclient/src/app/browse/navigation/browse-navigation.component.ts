import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MpdCommands } from "../../shared/mpd/mpd-commands";
import { BrowseService } from "../../shared/services/browse.service";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";

@Component({
  selector: "app-navigation",
  templateUrl: "./browse.navigation.component.html",
  styleUrls: ["./browse.navigation.component.scss"],
})
export class BrowseNavigationComponent implements OnInit {
  @ViewChild("filterInputElem") filterInputElem!: ElementRef;
  getParamDir = "";
  filter = "";

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private browseService: BrowseService,
    private activatedRoute: ActivatedRoute,
    private webSocketService: WebSocketService,
    private messageService: MessageService
  ) {}

  @HostListener("document:keydown.f", ["$event"])
  onSearchKeydownHandler(event: KeyboardEvent): void {
    // Ignore events that come from input elements
    const isFromInput = (event.target as HTMLInputElement).tagName === "INPUT";
    if (!isFromInput) {
      event.preventDefault();
      (this.filterInputElem.nativeElement as HTMLElement).focus();
    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const dir = <string>queryParams.dir || "/";
      this.getParamDir = dir;
      this.browseService.sendBrowseReq(dir);
    });
  }

  onAddDir(dir: string): void {
    if (typeof dir !== "string") {
      return;
    }
    if (dir.startsWith("/")) {
      dir = dir.substr(1, dir.length);
    }
    this.webSocketService.sendData(MpdCommands.ADD_DIR, {
      dir,
    });
    this.notificationService.popUp(`Added dir: "${dir}"`);
  }

  onPlayDir(dir: string): void {
    this.onAddDir(dir);
    this.webSocketService.send(MpdCommands.SET_PLAY);
    this.notificationService.popUp(`Playing dir: "${dir}"`);
  }

  onMoveDirUp(): void {
    const splitted = this.getParamDir.split("/");
    splitted.pop();
    let targetDir = splitted.join("/");
    if (targetDir.length === 0) {
      targetDir = "/";
    }
    this.router
      .navigate(["browse"], { queryParams: { dir: targetDir } })
      .then((fulfilled) => {
        if (fulfilled) {
          this.getParamDir = targetDir;
        }
      })
      .catch(() => void 0);
  }

  onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
    this.webSocketService.send(MpdCommands.GET_QUEUE);
    this.notificationService.popUp("Cleared queue");
  }

  applyFilter(filterValue: string): void {
    this.filter = filterValue;
    if (filterValue) {
      this.messageService.sendMessage(
        InternalMessageType.BrowseFilter,
        filterValue
      );
    } else {
      this.resetFilter();
    }
  }

  resetFilter(): void {
    this.filter = "";
    this.messageService.sendMessage(InternalMessageType.BrowseFilter, "");
  }
}