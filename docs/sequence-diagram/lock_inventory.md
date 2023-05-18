##### Inventory receive - Lock inventory sequence diagram 

```plantuml
@startuml

participant "Controller" as controller
participant "InventoryLockService" as service
participant "LockService" as lockService
participant "WarehouseService" as warehouseService
participant "InventoryService" as inventoryService
participant "InventoryLockRepo" as inventoryLockRepo

group Create lock inventory
    controller -> service: Lock inventory
    note right
        lockId: number
        whId: number
        inventoryId: number
        inventoryLockQuantity: number
    end note

    service -> lockService: Get lock by id \n lockService.findOne({ id: lockId })
    
    alt lock not found
        lockService --> service: undefined
        service --> service: InvalidRequestException\n('Lock not found')
    end
    |||
    |||

    service -> warehouseService: Get warehouse by id \n warehouseRepo.findOne({ id: whId })

    alt warehouse not found
        warehouseService --> service: undefined
        service --> service: InvalidRequestException\n('WH not found')
    end
    |||
    |||

    service -> inventoryService: Get inventory by id \n inventoryService.findOne({ id: inventoryId, whId: whId })

    alt
        inventoryService --> service: undefined
        service --> service: InvalidRequestException\n('Inventory not found')
    end

    |||
    |||

    ' service -> inventoryLockRepo: inventoryLockRepo.findOne({ whId: whId, inventoryId: inventoryId })
    ' inventoryLockRepo --> service: InventoryLock

    service -> service: Check lock able inventory quantity

    alt inventory.quantity - inventoryLockQuantity < 0
        service --> service: inventoryLockQuantity InvalidRequestException\n('Not enough inventory in the warehouse')
    end

    service -> inventoryLockRepo: Lock inventory

    note right
        lockId: number
        whId: number
        inventoryId: number
        inventoryLockQuantity: number
    end note

    inventoryLockRepo --> service: Return locked inventory result

    service --> controller: Return locked inventory result

    |||
    |||
end

|||
|||

group Unlock inventory
    controller -> service: Unlock inventory

    note right
        inventoryLockId: number
    end note

    service -> lockService: Get lock by id \n lockService.findOne({ id: inventoryLockId })

    alt lock not found
        lockService --> service: undefined
        service --> service: InvalidRequestException\n('Inventory lock not found')
    end

    service --> lockService: Delete inventory with { id: inventoryLockId }

    lockService --> service: Return deleted inventory lock response

    service --> controller: Return deleted inventory lock response
end

@enduml
```