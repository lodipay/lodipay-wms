### Inventory receive sequence diagram

```plantuml

@startuml
actor "WH staff" as staff
participant "WHS" as whs
participant "Database" as db
participant "Event bus" as eb

!$transferStatusReady = "READY"
!$statusReceived = "RECEIVED"
!$inventoryStatusTransfered = "ORDERED"
!$inventoryStatusExtra = "EXTRA"
!$inventoryStatusDamaged = "DAMAGED"
!$inventoryStatusWrong = "WRONG"

staff -> whs ++: Get transfer list page
note right
    ?page={page_number}

    wh_id={id}
end note
whs -> db ++: Get transfers
db --> whs --: Return transfers
whs --> staff --: Transfers list page

alt 
    staff -> whs ++: Search transfer by filter
    note right
        status=$transferStatusReady
    end note
    whs -> db : Get transfers by filter
    db --> whs: Return filter result
    whs --> staff --: Transfers list by query page
end

|||

staff -> staff ++--: Select transfer

|||

staff -> whs ++: Get selected transfer information
note right
    transfer_id={transfer_id}
end note
whs -> db ++: Get selected transfer by ID
db --> whs --: Return transfer information & inventory list
whs --> staff --: Selected transfer page && inventory list

staff -> staff ++--: Fill required inventories information

staff -> whs++: Save the inventory information
note right
    transfer_id={transfer_id}
    warehouse_id={warehouse_id}
    inventory_id={inventory_id}
    quantity={items_quantity}
    exp_date={expire_date}
    inventory_status=$inventoryStatusTransfered | $inventoryStatusExtra | $inventoryStatusDamaged | $inventoryStatusWrong
    description={description}
end note

|||

whs -> db ++: Save inventory information
db --> whs --: Return saved inventories
whs ->> eb: Received inventories information
whs --> staff: Saved inventories information page

@enduml
```
