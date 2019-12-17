public with sharing class MixPageController
{

    @AuraEnabled (cacheable = true)
    public static List<Song__c> getSongsList()
    {
        return [
            SELECT Id, Name, Artist__c, Genre__c, Track_Licenses__c, Track_Count__c, Length_m__c 
            FROM Song__c 
            LIMIT 20000
        ];      
    }

    @AuraEnabled (cacheable = true)
    public static Integer getPageSize()
    {
        MixPage__c mixPage = MixPage__c.getInstance(UserInfo.getProfileId());
        System.debug(mixPage.Page_Size__c.intValue());
        return mixPage.Page_Size__c.intValue();
    }

    @AuraEnabled (cacheable = true)
    public static List<String> getTrackList(String mixId)
    {
        List<String> songsIds = new List<String>();
        List<Track__c> mixTracks = [
            SELECT ID, Song__c 
            FROM Track__c 
            WHERE Mix__c = :mixId 
            LIMIT 20
        ];

        for(Track__c track : mixTracks)
        {
            songsIds.add(track.Song__c);
        }

        return songsIds;
    }

    @AuraEnabled
    public static void saveMix(List<String> songsIds, String mixId, String mixName, String mixCustomer)
    {
        List<Track__c> tracksToCreate = new List<Track__c>();
        Mix__c mix = new Mix__c();

        if(String.isNotEmpty(mixId))
        {
            mix.Id = mixId; 
            List<Track__c> mixTracks = [
                SELECT ID, Song__c
                FROM Track__c 
                WHERE Mix__c = : mixId
                LIMIT 20
            ];
            delete mixTracks;
        }

        if (songsIds.isEmpty())
        {
            mix.Primary_Genre__c = '';
            mix.Secondary_Genre__c = '';
        }

        mix.Name = mixName;
        mix.Customer__c = mixCustomer;
        upsert mix;

        for (String songId : songsIds)
        {
            Track__c tempTrack = new Track__c();
            tempTrack.Mix__c = mix.Id;
            tempTrack.Song__c = songId;
            tracksToCreate.add( tempTrack);
        }
      
        try
        {
            insert tracksToCreate;  
        }
        catch (DmlException exc)
        {
            String message = 'Error. Please contact your Administrator';

            if (exc.getMessage().contains('FIELD_CUSTOM_VALIDATION_EXCEPTION'))
            {
                message = 'Please select song with license. Song without license:';
                List<Song__c> songs = [
                    SELECT Track_Licenses__c, Track_Count__c, Name
                    FROM Song__c 
                    WHERE Id IN :songsIds
                ];

                for (Song__c song : songs)
                {
                    if ((song.Track_Licenses__c - song.Track_Count__c) < 1) 
                    {
                        message = message + ' ' + song.Name + ',';
                    }
                }

                message = message.removeEnd(',');
                message = message + '.';
            }
            
            throw new AuraHandledException(message);
        }
    }  
}