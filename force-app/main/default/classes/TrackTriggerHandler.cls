public class TrackTriggerHandler implements TriggerTemplate.Handler {

    public static Boolean enablesTrigger = true;
    private List<Track__c> newValues = null;
    private Map<Id, Track__c> oldValues = null;

    public void setValues(List<sObject> newValues, Map<Id, sObject> oldValues)
    {
        this.newValues = newValues;
        this.oldValues = (Map<Id, Track__c>) oldValues;
    }

    public void handle(TriggerTemplate.TriggerAction action)
    {
        if (action == TriggerTemplate.TriggerAction.beforeInsert)
        {
            TrackService.updateRelatedFieldsForInsert(this.newValues);
        } 

        else if (action == TriggerTemplate.TriggerAction.afterDelete)
        {
            TrackService.updateRelatedFieldsForDelete(this.oldValues.values());
        }
    }
}