public class TrackService
 {
    public static void updateRelatedFieldsForInsert(List<Track__c> tracks)
    { 
        Map<Id, Song__c> songsWithGenre = new Map <Id, Song__c>();
        songsWithGenre = getGenreSongs(tracks);
        updateSongsTrackCount(songsWithGenre, tracks, true);
        updateMixGengre(tracks, songsWithGenre);
    }

    public static Map<Id,List<Id>> getSongsIdsByMixesIds(List<Track__c> tracks)
    {
        Map<Id,List<Id>> songsIdsByMixesIds = new Map<Id,List<Id>>();

        for (Track__c track : tracks)
        {
            List<Id> songsIdsForMix = songsIdsByMixesIds.get(track.Mix__c);

            if (songsIdsForMix != null)
            {
                songsIdsForMix.add(track.Song__c);
                songsIdsByMixesIds.put(track.Mix__c, songsIdsForMix);
            }
            else
            {
                songsIdsForMix = new List<Id>();
                songsIdsForMix.add(track.Song__c);
                songsIdsByMixesIds.put(track.Mix__c, songsIdsForMix);
            }
        }

        return songsIdsByMixesIds;
    }

    public static void updateMixGengre(List<Track__c> tracks, Map<Id, Song__c> songsWithGenre)
    {
        List<Mix__c> mixesToUpdate = new List<Mix__c>();
        Map<Id,List<Id>> songsIdsByMixesIds = getSongsIdsByMixesIds(tracks);
        
         for (Id mixId : songsIdsByMixesIds.keySet())
        {
            Map<String, Integer> genreValues = new Map<String,Integer>();
            List<String> primarAndSecondaryGenre = new List<String>();
            Mix__c mix = new Mix__c ();
            mix.Id = mixId;

            for (Id song : songsIdsByMixesIds.get(mixId))
            {
               String genre = songsWithGenre.get(song).Genre__c;
               if (genreValues.get(genre) != null)
               {
                   genreValues.put(genre, (genreValues.get(genre) + 1));
               }
               else
               {
                   genreValues.put(genre, 1);
               } 
            }
            
            primarAndSecondaryGenre = sortMapByKeyAndValue(genreValues);
            mix.Primary_Genre__c = primarAndSecondaryGenre[0];

            if(primarAndSecondaryGenre.size() > 1)
            {
                mix.Secondary_Genre__c = primarAndSecondaryGenre[1];
            }

            mixesToUpdate.add(mix);
        }

        update mixesToUpdate;
    }

    private static List<String> sortMapByKeyAndValue(Map<String, Integer> mapToSort)
    {
        List<String> keys = new List<String>(mapToSort.keySet());
        List<Integer> values = new List<Integer>(mapToSort.values());
        List<String> primarAndSecondaryGenre = new List<String>();
        String primaryGenre;
        String secondaryGenre;
        keys.sort();
        values.sort();
        Integer sizeValues = values.size();
        Integer primaryCount = values[sizeValues - 1];
        Integer secondaryCount;

        if (sizeValues > 1)
        {
            secondaryCount = values[sizeValues - 2];
        }
    
        for (String key : keys)
        {
            Integer value = mapToSort.get(key);
     
            if (value == primaryCount && String.isEmpty(primaryGenre))
            {
                primaryGenre = key;     
            } 
            else if (sizeValues > 1 && value == secondaryCount && String.isEmpty(secondaryGenre))
            {
                secondaryGenre = key;
            }
        }

        primarAndSecondaryGenre.add(primaryGenre);
        primarAndSecondaryGenre.add(secondaryGenre);
        return primarAndSecondaryGenre;
    }

    public static Map<Id, Song__c> getGenreSongs(List<Track__c> tracks)
    {
        List<Id> songsIds = new List<Id>();

        for (Track__c track : tracks)
        {
            songsIds.add(track.Song__c);
        }

        return new Map<Id, Song__c>([
            SELECT Id, Name, Genre__c, Track_Count__c 
            FROM Song__c 
            WHERE Id IN :songsIds
        ]);
    }

    private static void updateSongsTrackCount(Map<Id, Song__c> songs, List<Track__c> tracks, Boolean isInsert)
    {
        Map<Id, Integer> idSongsAndCounts = new Map<Id, Integer>();

        for (Track__c track : tracks)
        {
            Integer count = idSongsAndCounts.get(track.Song__c);

            if(count != null)
            {
                idSongsAndCounts.put(track.Song__c, count + 1);
            }
            else
            {
                idSongsAndCounts.put(track.Song__c, 1);
            }
        }

        for (Song__c song : songs.values())
        {
            if(isInsert)
            {
                song.Track_Count__c += + idSongsAndCounts.get(song.Id);
            }
            else 
            {
                song.Track_Count__c -= idSongsAndCounts.get(song.Id);
            }
        }
        
        update songs.values();
    } 

    public static void updateRelatedFieldsForDelete(List<Track__c> tracksToDelete)
    {
        Map<Id, Song__c> songsIdsToUpdateTrackCount = new Map<Id, Song__c>();
        songsIdsToUpdateTrackCount = TrackService.getGenreSongs(tracksToDelete);
        TrackService.updateSongsTrackCount(songsIdsToUpdateTrackCount, tracksToDelete, false);
    }
}