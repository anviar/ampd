package org.hihn.ampd.server.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Handles access to the ampd dir. Usually, ~/.local/share/ampd/.
 */
@Service
public class AmpdDirService {

  /**
   * Name of the dir that holds all covers.
   */
  private static final String CACHE_DIR_NAME = "covers";

  /**
   * Name of the meta file that holds all metadata of tracks.
   */
  private static final String MEATA_FILE_NAME = "meta.txt";

  @Value("${mpd.meta.directory}")
  private String metaDirectory;

  private static final Logger LOG = LoggerFactory.getLogger(AmpdDirService.class);

  /**
   * Name of the text file that contains all tracks that are banned from getting a MusicBrainz
   * cover.
   */
  private static final String MB_BLACKLIST_FILE = "mb_blacklist.txt";

  /**
   * Returns the path of the file that contains the files that are banned from getting a cover from
   * MusicBrainz. Creates it, if it doesn't exist.
   *
   * @return The path of the blacklist file.
   */
  public Optional<Path> getBlacklistFile() {
    final Path path = Paths
        .get(System.getProperty("user.home"), ".local", "share", "ampd", MB_BLACKLIST_FILE);
    if (!Files.exists(path)) {
      try {
        boolean created = path.toFile().createNewFile();
        if (!created) {
          LOG.debug("File already exists: {}", path);
        }
      } catch (IOException e) {
        LOG.error("Could not create the MusicBrainz blacklist file: {}", path);
        return Optional.empty();
      }
    }
    if (!Files.exists(path)) {
      LOG.warn(
          "Could not find the MusicBrainz blacklist file: {}. This is not fatal, "
              + "it just means, we can't save or load the list of files which "
              + "should not get a MusicBrainz cover.",
          path);
      return Optional.empty();
    }
    if (!new File(path.toString()).canWrite()) {
      LOG.warn("Cannot write MusicBrainz blacklist file: {}", path);
      return Optional.empty();
    }
    return Optional.of(path);
  }

  /**
   * Returns the path of the ampd cache directory. Creates it, if it doesn't exist.
   *
   * @return The path of the cache dir.
   */
  public Optional<Path> getCacheDir() {
    final Path cacheDirPath = Paths
        .get(System.getProperty("user.home"), ".local", "share", "ampd", CACHE_DIR_NAME);
    // create ampd home
    if (!Files.exists(cacheDirPath) && !new File(cacheDirPath.toString()).mkdirs()) {
      LOG.warn(
          "Could not create ampd home-dir: {}. This is not fatal, "
              + "it just means, we can't save or load covers to the local cache.",
          cacheDirPath);
      return Optional.empty();
    }
    return Optional.of(cacheDirPath);
  }

  /**
   * Returns the path of the ampd meta file. Creates it, if it doesn't exist.
   *
   * @return The path of the meta dir.
   */
  public Optional<Path> getMetaFile() {
    final Path path = Paths
            .get(metaDirectory, MEATA_FILE_NAME);

    if (!Files.exists(path)) {
      try {
        boolean created = path.toFile().createNewFile();
        if (!created) {
          LOG.debug("File already exists: {}", path);
        }
      } catch (IOException e) {
        LOG.error("Could not create the meta file: {}", path);
        return Optional.empty();
      }
    }
    if (!Files.exists(path)) {
      LOG.warn(
              "Could not find the meta file: {}. This is not fatal, "
                      + "it just means, we can't save or load the meta files which "
                      + "shoud describe music tracks.",
              path);
      return Optional.empty();
    }
    if (!new File(path.toString()).canWrite()) {
      LOG.warn("Cannot write meta file: {}", path);
      return Optional.empty();
    }
    return Optional.of(path);
  }
}

