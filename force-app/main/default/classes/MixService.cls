public with sharing class MixService 
{

    public static void deleteRelatedTracks(Set<Id> mixesIds) 
    {
        List<Track__c> tracksToDelete = [
            SELECT Id, Song__c
            FROM Track__c 
            WHERE Mix__c IN :mixesIds
        ];
        delete tracksToDelete; 
    }
    
}
