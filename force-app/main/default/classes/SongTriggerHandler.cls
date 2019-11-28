public class SongTriggerHandler implements TriggerTemplate.Handler 
{
    public static Boolean enablesTrigger = true;
    private List<Song__c> newValues = null;
    private Map<Id, Song__c> oldValues = null;

    public void setValues(List<sObject> newValues, Map<Id, sObject> oldValues)
    {
        this.newValues = newValues;
        this.oldValues = (Map<Id, Song__c>) oldValues;
    }

    public void handle(TriggerTemplate.TriggerAction action)
    {
        // Move it to Song Service!
        if (action == TriggerTemplate.TriggerAction.beforeDelete)
        {
            List<Id> songsIds = new List<Id>(this.oldValues.keySet());
            List<Id> mixesIds = new List<Id>();
            List<Track__c> traksToDelete = [
                SELECT Id, Mix__c
                FROM Track__C 
                WHERE Song__c IN :songsIds
                ];
            for(Track__C track : traksToDelete)
            {
                mixesIds.add(track.Mix__c);
            }

            List<Track__c> tracksToUpdate = [
                SELECT Mix__c, Song__c, Song__r.Genre__c
                FROM Track__C 
                WHERE Mix__c IN :mixesIds AND Song__c NOT IN :songsIds
            ];
            TrackService.updateMixGengre(tracksToUpdate, TrackService.getGenreSongs(tracksToUpdate));
            delete traksToDelete; 
        }
    }

}