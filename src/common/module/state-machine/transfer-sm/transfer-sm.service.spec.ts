import { Test, TestingModule } from '@nestjs/testing';
import { TransferSMService } from './transfer-sm.service';

describe('TransferSMService', () => {
    let service: TransferSMService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TransferSMService],
        }).compile();

        service = module.get<TransferSMService>(TransferSMService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
