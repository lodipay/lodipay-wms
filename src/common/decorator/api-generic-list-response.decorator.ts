import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { GenericResponseDto } from '../dto/generic-response.dto';

export const ApiGenericListResponse = <TModel extends Type<any>>(
    model: TModel,
) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(GenericResponseDto) },
                    {
                        properties: {
                            result: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
};
