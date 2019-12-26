@isTest
private class TrackTriggerTest
{
    // @TestSetup
    // static void setup()
    // {
    //     Song__c songTest = new Song__c();
    //     songTest.Name = 'Test';
    //     songTest.Artist__c = 'Test Test';
    //     songTest.Genre__c = 'Pop';
    //     songTest.Length_m__c = 5;
    //     songTest.Track_Licenses__c = 5;
    //     insert songTest;

    //     Mix__c mixTest = new Mix__c();
    //     mixTest.Name = 'test';
    //     insert mixTest;
        
    // }

    @isTest 
    static void insertTrack()
    {
        Song__c songTest = new Song__c();
        songTest.Name = 'Test';
        songTest.Artist__c = 'Test Test';
        songTest.Genre__c = 'Pop';
        songTest.Length_m__c = 5;
        songTest.Track_Licenses__c = 5;
        Song__c songTestSecond = new Song__c();
        songTestSecond.Name = 'Test';
        songTestSecond.Artist__c = 'Test Test';
        songTestSecond.Genre__c = 'R&B';
        songTestSecond.Length_m__c = 5;
        songTestSecond.Track_Licenses__c = 5;
        insert songTestSecond;
        insert songTest;

        Mix__c mixTest = new Mix__c();
        mixTest.Name = 'test';
        insert mixTest;

        Track__c trackTestFirst = new Track__c();
        trackTestFirst.Mix__c = mixTest.Id;
        trackTestFirst.Song__c = songTest.Id;
        Track__c trackTestSecond = new Track__c();
        trackTestSecond.Mix__c = mixTest.Id;
        trackTestSecond.Song__c = songTestSecond.Id;
        Test.startTest();
            insert trackTestFirst;
            insert trackTestSecond;
        Test.stopTest();

    }

}