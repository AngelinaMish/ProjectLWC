public with sharing class mixSongsController {

    @AuraEnabled (cacheable = true)
    public static List<Song__c> getSongsList()
    {
        return [SELECT Id, Name, Artist__c, Genre__c, Length_m__c FROM Song__c LIMIT 20000];      
    }
    
}
