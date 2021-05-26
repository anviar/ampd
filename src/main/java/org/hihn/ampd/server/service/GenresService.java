package org.hihn.ampd.server.service;

import java.util.Arrays;
import java.util.Collection;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Stream;
import org.bff.javampd.genre.MPDGenre;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SongSearcher.ScopeType;
import org.springframework.stereotype.Service;

@Service
public class GenresService {

  private final MPD mpd;

  public GenresService(MPD mpd) {
    this.mpd = mpd;
  }

  public Set<String> listAll() {
    foo();
    Set<String> ret = new TreeSet<>();
    Collection<MPDGenre> mpdGenres = mpd.getMusicDatabase().getGenreDatabase().listAllGenres();
    for (MPDGenre genre : mpdGenres) {
      if (genre.getName().equals("")) {
        continue;
      }
      String[] splitted = genre.getName().split(",");
      Arrays.stream(splitted).forEach(g -> ret.add(g.trim()));
    }
    return ret;
  }

  private void foo() {
    Collection<MPDSong> res = mpd.getSongSearcher().search(ScopeType.GENRE, "Jazz");
    System.out.println(1);
  }
}
