public with sharing class SongService
{
    public static void deleteRelatedTracks(Set<Id> songsIds)
    {
        List<Id> mixesIds = new List<Id>();
        List<Track__c> traksToDelete = [
            SELECT Id, Mix__c
            FROM Track__c 
            WHERE Song__c IN :songsIds
        ];

        for(Track__c track : traksToDelete)
        {
            mixesIds.add(track.Mix__c);
        }

        List<Track__c> tracksToUpdate = [
            SELECT Mix__c, Song__c, Song__r.Genre__c
            FROM Track__c 
            WHERE Mix__c IN :mixesIds AND Song__c NOT IN :songsIds
        ];
        TrackService.updateMixGengre(tracksToUpdate, TrackService.getGenreSongs(tracksToUpdate));
        delete traksToDelete; 
    }
}
