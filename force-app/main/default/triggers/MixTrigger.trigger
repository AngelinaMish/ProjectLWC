trigger MixTrigger on Mix__c (before delete) 
{
    if (TrackTriggerHandler.enablesTrigger)
    {
        TriggerTemplate.TriggerManager triggerManager = new TriggerTemplate.TriggerManager();
        triggerManager.addHandler(new MixTriggerHandler(), new List<TriggerTemplate.TriggerAction>
        {
            TriggerTemplate.TriggerAction.beforeDelete
        });
        triggerManager.runHandlers();
    }
}