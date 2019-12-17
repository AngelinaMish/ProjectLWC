trigger TrackTrigger on Track__c (before insert, after delete) 
{
    if (TrackTriggerHandler.enablesTrigger)
    {
        TriggerTemplate.TriggerManager triggerManager = new TriggerTemplate.TriggerManager();
        triggerManager.addHandler(new TrackTriggerHandler(), new List<TriggerTemplate.TriggerAction>
        {
            TriggerTemplate.TriggerAction.beforeInsert, TriggerTemplate.TriggerAction.afterDelete
        });
        triggerManager.runHandlers();
    }
}       