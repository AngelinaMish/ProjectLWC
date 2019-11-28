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
            // Move it to Mix Trigger Service!
            // Do not need list here!
            List<Id> mixesIds = new List<Id>(this.oldValues.keySet());
            List<Track__c> traksToDelete = [
                SELECT Id, Song__c
                FROM Track__C 
                WHERE Mix__c IN :mixesIds
                ];
            delete traksToDelete; 
        }
    }
}