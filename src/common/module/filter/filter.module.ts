import { Global, Module } from '@nestjs/common';
import { FilterService } from './filter.service';

@Module({
  providers: [FilterService],
  exports: [FilterService],
})
@Global()
export class FilterModule {}
