package org.hihn.ampd.server.service;

import java.util.Arrays;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Stream;
import org.bff.javampd.genre.MPDGenre;
import org.bff.javampd.server.MPD;
import org.springframework.stereotype.Service;

@Service
public class GenresService {

  private final MPD mpd;

  public GenresService(MPD mpd) {
    this.mpd = mpd;
  }

  public Set<String> listAll() {
    Set<String> ret = new TreeSet<>();
    for (MPDGenre genre : mpd.getMusicDatabase().getGenreDatabase().listAllGenres()) {
      if (genre.getName().equals("")) {
        continue;
      }
      String[] splitted = genre.getName().split(",");
      Arrays.stream(splitted).forEach(g -> ret.add(g.trim()));
    }
    return ret;
  }
}
