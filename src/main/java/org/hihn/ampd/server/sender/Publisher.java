package org.hihn.ampd.server.sender;

import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.incoming.MpdModesPanelMsg;
import org.hihn.ampd.server.message.outgoing.StatePayload;
import org.hihn.ampd.server.model.MetaDataSong;
import org.hihn.ampd.server.service.AmpdDirService;
import org.hihn.ampd.server.service.MetaDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Repeatedly sends information via websocket. Keeps all conntected clients up to date.
 */
@Component
public class Publisher {

  private static final String QUEUE_URL = "/topic/queue";

  private static final String STATE_URL = "/topic/state";

  private final MPD mpd;

  private final SimpMessagingTemplate template;

  private final MetaDataService metaDataService;

  @Autowired
  public Publisher(
          final MPD mpd,
          final SimpMessagingTemplate template, MetaDataService metaDataService) {
    this.mpd = mpd;
    this.template = template;
    this.metaDataService = metaDataService;
  }

  /**
   * Publishes the queue every second.
   */
  @Scheduled(fixedRateString = "${publisher.delay}")
  public void publishQueue() {
    if (!mpd.isConnected()) {
      return;
    }
    // Tells javampd to get fresh data every second
    mpd.getServerStatus().setExpiryInterval(1L);
    template.convertAndSend(QUEUE_URL, mpd.getPlaylist().getSongList());
  }

  /**
   * Publishes the Mpd server state every second.
   */
  @Scheduled(fixedRateString = "${publisher.delay}")
  public void publishState() {
    if (!mpd.isConnected()) {
      return;
    }
    // Tells javampd to get fresh data every second
    mpd.getServerStatus().setExpiryInterval(1L);
    final MpdModesPanelMsg mpdModesPanelMsg = new MpdModesPanelMsg(mpd.getServerStatus());
    MPDSong song = mpd.getPlayer().getCurrentSong();
    updateSongWithMetaData(song);
    final StatePayload statePayload =
        new StatePayload(mpd.getServerStatus(), song, mpdModesPanelMsg);
    template.convertAndSend(STATE_URL, statePayload);
  }

  private void updateSongWithMetaData(MPDSong song) {
    MetaDataSong metaSong = metaDataService.getMetaDataSongMap().get(song.getFile());
    if(metaSong != null){
      song.setAlbumName(metaSong.getAlbumName());
      song.setArtistName(metaSong.getArtistName());
      song.setTitle(metaSong.getTitle());
      song.setComment(metaSong.getComment());
      song.setGenre(metaSong.getGenre());
      song.setYear(metaSong.getYear());
    }
  }
}
