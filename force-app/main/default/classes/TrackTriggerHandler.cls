public class TrackTriggerHandler implements TriggerTemplate.Handler {

    public static Boolean enablesTrigger = true;
    private List<Track__C> newValues = null;
    private Map<Id, Track__C> oldValues = null;

    public void setValues(List<sObject> newValues, Map<Id, sObject> oldValues)
    {
        this.newValues = newValues;
        this.oldValues = (Map<Id, Track__C>) oldValues;
    }

    public void handle(TriggerTemplate.TriggerAction action)
    {
        if (action == TriggerTemplate.TriggerAction.afterInsert)
        {
            TrackService.updateRelatedFieldsForInsert(this.newValues);
        } 

        else if (action == TriggerTemplate.TriggerAction.afterDelete)
        {
            TrackService.updateRelatedFieldsForDelete(this.oldValues.values());
        }
    }
}