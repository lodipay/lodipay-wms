import { UnderscoreNamingStrategy } from '@mikro-orm/core';

export class CustomNamingStrategy extends UnderscoreNamingStrategy {
    classToTableName(targetName: string): string {
        return 't_' + super.classToTableName(targetName);
    }

    joinColumnName(propertyName: string): string {
        return 'c_' + propertyName;
    }

    joinKeyColumnName(
        entityName: string,
        referencedColumnName?: string,
    ): string {
        return (
            'c_' +
            this.classToTableName(entityName).replace(/^t_/, '') +
            '_' +
            referencedColumnName
        );
    }

    propertyToColumnName(propertyName: string): string {
        if (propertyName === 'id') {
            return 'id';
        }
        return 'c_' + super.propertyToColumnName(propertyName);
    }
}
