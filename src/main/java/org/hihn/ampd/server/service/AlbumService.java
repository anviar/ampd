package org.hihn.ampd.server.service;

import java.util.Collection;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;
import org.bff.javampd.album.AlbumDatabase;
import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.server.MPD;
import org.springframework.stereotype.Service;

@Service
public class AlbumService {

  private final MPD mpd;

  public AlbumService(MPD mpd) {
    this.mpd = mpd;
  }

  public Collection<MPDAlbum> getAlbums() {
    return mpd.getMusicDatabase().getAlbumDatabase().listAllAlbums(0, 100)
        .stream()
        .filter(a -> !a.getArtistName().equals("") && !a.getName().equals("") )
        .collect(Collectors.toSet());
  }
}
