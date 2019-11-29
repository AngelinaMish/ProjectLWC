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
        if (action == TriggerTemplate.TriggerAction.beforeDelete)
        {
            SongService.deleteRelatedTracks(this.oldValues.keySet());
        }
    }
}