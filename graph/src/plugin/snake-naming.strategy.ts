import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

/**
 * Converts string into snake_case.
 *
 */
export function snakeCase(str: string): string{
    return str
        // ABc -> a_bc
        .replace(/([A-Z])([A-Z])([a-z])/g, "$1_$2$3")
        // aC -> a_c
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .toLowerCase();
}

export class SnakeNamingStrategy
    extends DefaultNamingStrategy
    implements NamingStrategyInterface {
    tableName(className: string, customName: string): string {
        return customName ? customName : snakeCase(className);
    }

    columnName(
        propertyName: string,
        customName: string,
        embeddedPrefixes: string[],
    ): string {
        return (
            snakeCase(embeddedPrefixes.concat('').join('_')) +
            (customName ? customName : snakeCase(propertyName))
        );
    }

    relationName(propertyName: string): string {
        return snakeCase(propertyName);
    }

    joinColumnName(relationName: string, referencedColumnName: string): string {
        return snakeCase(relationName + '_' + referencedColumnName);
    }

    joinTableName(
        firstTableName: string,
        secondTableName: string,
        firstPropertyName: string,
        secondPropertyName: string,
    ): string {
        return snakeCase(
            firstTableName +
            '_' +
            firstPropertyName.replace(/\./gi, '_') +
            '_' +
            secondTableName,
        );
    }

    joinTableColumnName(
        tableName: string,
        propertyName: string,
        columnName?: string,
    ): string {
        return snakeCase(
            tableName + '_' + (columnName ? columnName : propertyName),
        );
    }

    classTableInheritanceParentColumnName(
        parentTableName: any,
        parentTableIdPropertyName: any,
    ): string {
        return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
    }

    eagerJoinRelationAlias(alias: string, propertyPath: string): string {
        return alias + '__' + propertyPath.replace('.', '_');
    }
}
