package org.hihn.ampd.server.controller;

import java.util.Collection;
import java.util.Set;
import java.util.TreeSet;
import org.bff.javampd.album.MPDAlbum;
import org.hihn.ampd.server.service.AlbumService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint to retrieve browsing info.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class AlbumController {

  private final AlbumService albumService;

  public AlbumController(AlbumService albumService) {
    this.albumService = albumService;
  }

  @GetMapping("/albums")
  public Collection<MPDAlbum> albums() {
    return albumService.getAlbums();
  }
}
