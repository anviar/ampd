package org.hihn.ampd.server.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.Collection;
import java.util.Set;
import org.bff.javampd.genre.MPDGenre;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.outgoing.browse.BrowsePayload;
import org.hihn.ampd.server.service.GenresService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/genres")
@CrossOrigin
public class GenresController {

  private final GenresService genresService;

  public GenresController(GenresService genresService) {
    this.genresService = genresService;
  }

  @GetMapping("/")
  public Set<String> genres() {
    return genresService.listAll();
  }

  @RequestMapping(value = "/{genre}", method = GET)
  public Collection<MPDSong> listSongs(@PathVariable("genre") final String genre) {
    return genresService.listSongs(genre);
  }
}
