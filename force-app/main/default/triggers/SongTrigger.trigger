trigger SongTrigger on Song__c (before delete) 
{
    if (TrackTriggerHandler.enablesTrigger)
    {
        TriggerTemplate.TriggerManager triggerManager = new TriggerTemplate.TriggerManager();
        triggerManager.addHandler(new SongTriggerHandler(), new List<TriggerTemplate.TriggerAction>
        {
            TriggerTemplate.TriggerAction.beforeDelete
        });
        triggerManager.runHandlers();
    }
}