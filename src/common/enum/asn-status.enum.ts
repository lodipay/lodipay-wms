export enum AsnStatus {
    PENDINGARRIVAL = 'pending arrival',
    PENDINGUNLOADING = 'pending unloading',
    
    WAITINGFORUNLOADING = 'waiting for unloading',
    UNLOADED = 'unloaded',

    WAITINGFORSORTING = 'waiting for sorting,',
    SORTED = 'sorted',
    
    CONFIRMED = 'confirmed',
    FINISHRECEIVING = 'finish receiving',
}