package org.hihn.ampd.server.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hihn.ampd.server.model.MetaDataSong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Handles the metadate of tracks.
 */
@Service
public class MetaDataService {

    private static final Logger LOG = LoggerFactory.getLogger(MetaDataService.class);

    private final AmpdDirService ampdDirService;

    private Map<String, MetaDataSong> metaDataSongMap = new HashMap<>();
    private Long lastModified = 0L;

    public MetaDataService(AmpdDirService ampdDirService) {
        this.ampdDirService = ampdDirService;
    }

    public Map<String, MetaDataSong> getMetaDataSongMap() {
        return metaDataSongMap;
    }

    /**
     * Returns metadata of tracks in map from file.
     *
     * @return Path and content of the cover blacklist.
     */
    public Map<String, MetaDataSong> getMetaData() {

        if (ampdDirService.getMetaFile().isPresent()) {
            Path path = ampdDirService.getMetaFile().get();
            if (lastModified.equals(path.toFile().lastModified())) {
                return getMetaDataSongMap();
            } else {
                return loadMetaFile(path);
            }
        }
        LOG.warn("Can't reading meta file");
        return metaDataSongMap;
    }

    /**
     * Reads the meta file.
     *
     * @return The content of the meta file.
     */
    public Map<String, MetaDataSong> loadMetaFile(Path path) {
        metaDataSongMap = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();

        try (BufferedReader bufferedReader = Files.newBufferedReader(path)) {
            List<MetaDataSong> list = mapper.readValue(bufferedReader, new TypeReference<List<MetaDataSong>>(){});
            list.stream()
                    .forEach(song -> {
                        metaDataSongMap.put(song.getFile(), song);
                    });
            //lastModified = path.toFile().lastModified();
            return metaDataSongMap;
        } catch (IOException e) {
            //lastModified = 0l;
            LOG.error("Error reading meta", e);
        }
        return metaDataSongMap;
    }
}
