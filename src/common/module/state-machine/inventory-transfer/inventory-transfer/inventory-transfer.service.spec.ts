import { Test, TestingModule } from '@nestjs/testing';
import { InventoryTransferService } from './inventory-transfer.service';

describe('InventoryTransferService', () => {
    let service: InventoryTransferService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InventoryTransferService],
        }).compile();

        service = module.get<InventoryTransferService>(
            InventoryTransferService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
