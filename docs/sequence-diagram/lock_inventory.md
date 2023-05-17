##### Inventory receive - Lock inventory sequence diagram 

```plantuml
@startuml

participant "Controller" as controller
participant "LockService" as service
participant "LockRepo" as lockRepo
participant "WarehouseRepo" as whRepo
participant "WarehouseInventoryRepo" as invRepo
participant "InventoryLockRepo" as invLockRepo

group Create lock inventory
    controller -> service: Lock inventory
    note right
        lockId: number
        whId: number
        inventoryId: number
        inventoryLockQuantity: number
    end note

    service -> lockRepo: Get lock by id \n lockRepo.findOne({ id: lockId })
    
    alt lock not found
        lockRepo --> service: undefined
        service --> service: InvalidRequestException\n('Lock not found')
    end
    |||
    |||

    service -> whRepo: Get warehouse by id \n warehouseRepo.findOne({ id: whId })

    alt warehouse not found
        whRepo --> service: undefined
        service --> service: InvalidRequestException\n('WH not found')
    end
    |||
    |||

    service -> invRepo: Get inventory by id \n invRepo.findOne({ id: inventoryId, whId: whId })

    alt
        invRepo --> service: undefined
        service --> service: InvalidRequestException\n('Inventory not found')
    end

    |||
    |||

    service -> invLockRepo: invLockRepo.findOne({ whId: whId, inventoryId: inventoryId })
    invLockRepo --> service: InventoryLock

    service -> service: Check lock able inventory quantity

    alt inventory.quantity - inventoryLockQuantity < 0
        service --> service: inventoryLockQuantity InvalidRequestException\n('Not enough inventory in the warehouse')
    end

    service -> lockRepo: Lock inventory

    note right
        lockId: number
        whId: number
        inventoryId: number
        inventoryLockQuantity: number
    end note

    lockRepo --> service: Return locked inventory result

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

    service -> lockRepo: Get lock by id \n lockRepo.findOne({ id: inventoryLockId })

    alt lock not found
        lockRepo --> service: undefined
        service --> service: InvalidRequestException\n('Inventory lock not found')
    end

    service --> lockRepo: Delete inventory with { id: inventoryLockId }

    lockRepo --> service: Return deleted inventory lock response

    service --> controller: Return deleted inventory lock response
end

@enduml
```