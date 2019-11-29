public with sharing class MixService 
{
    public static void dleteRelatedTracks(Set<Id> mixesIds) 
    {
        List<Track__c> tracksToDelete = [
            SELECT Id, Song__c
            FROM Track__C 
            WHERE Mix__c IN :mixesIds
        ];
        delete tracksToDelete; 
    }
}
