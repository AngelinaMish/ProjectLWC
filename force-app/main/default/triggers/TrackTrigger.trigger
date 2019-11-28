trigger TrackTrigger on Track__c (after insert, after delete) 
{
    if (TrackTriggerHandler.enablesTrigger)
    {
        TriggerTemplate.TriggerManager triggerManager = new TriggerTemplate.TriggerManager();
        triggerManager.addHandler(new TrackTriggerHandler(), new List<TriggerTemplate.TriggerAction>
        {
            TriggerTemplate.TriggerAction.afterInsert, TriggerTemplate.TriggerAction.afterDelete
        });
        triggerManager.runHandlers();
    }
}       