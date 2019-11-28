public with sharing class mixSongsController {

    @AuraEnabled (cacheable = true)
    public static List<Song__c> getSongsList()
    {
        return [
            SELECT Id, Name, Artist__c, Genre__c, Track_Licenses__c, Track_Count__c, Length_m__c 
            FROM Song__c 
            LIMIT 20000
        ];      
    }

    @AuraEnabled (cacheable = true)
    public static List<String> getTrackList(String mixId)
    {
        List<String> songsIds = new List<String>();
        List<Track__c> mixTracks = [
            SELECT ID, Song__c 
            FROM Track__c 
            WHERE Mix__c = :mixId 
            LIMIT 20
        ];

        for(Track__c track : mixTracks)
        {
            songsIds.add(track.Song__c);
        }

        return songsIds;
    }

    @AuraEnabled
    public static void saveMix(List<String> songsIds, Mix__c mixId)
    {
        List<Track__c> tracksToCreate = new List<Track__c>();
        Mix__c mix = new Mix__c();

        if(String.isNotEmpty(mixId.Id))
        {
            mix.Id = mixId.Id;
            List<Track__c> mixTracks = [
                SELECT ID, Song__c 
                FROM Track__c 
                WHERE Mix__c = :mixId.Id 
                LIMIT 20
            ];
            delete mixTracks;
        }
        
        mix.Name = mixId.Name;
        mix.Customer__c = mixId.Customer__c;
        upsert mix;

        for (String songId : songsIds)
        {
            Track__c tempTrack = new Track__c();
            tempTrack.Mix__c = mix.Id;
            tempTrack.Song__c = songId;
            tracksToCreate.add( tempTrack);
        }
        
        insert tracksToCreate;       
    }  
}