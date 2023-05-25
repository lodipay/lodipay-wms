import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { GenericResponseDto } from '../dto/generic-response.dto';

export const ApiGenericResponse = <TModel extends Type<any>>(
    model: TModel | string,
) => {
    const isClass = typeof model === 'function' && model instanceof Function;

    const resultDefinition = isClass
        ? {
              $ref: getSchemaPath(model),
          }
        : {
              type: model,
          };

    return applyDecorators(
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(GenericResponseDto) },
                    {
                        properties: {
                            result: resultDefinition,
                        },
                    },
                ],
            },
        }),
    );
};
