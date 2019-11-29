public class MixTriggerHandler implements TriggerTemplate.Handler 
{
    public static Boolean enablesTrigger = true;
    private List<Mix__c> newValues = null;
    private Map<Id, Mix__c> oldValues = null;

    public void setValues(List<sObject> newValues, Map<Id, sObject> oldValues)
    {
        this.newValues = newValues;
        this.oldValues = (Map<Id, Mix__c>) oldValues;
    }

    public void handle(TriggerTemplate.TriggerAction action)
    {
        if (action == TriggerTemplate.TriggerAction.beforeDelete)
        {
           MixService.dleteRelatedTracks(this.oldValues.keySet()); 
        }
    }
}