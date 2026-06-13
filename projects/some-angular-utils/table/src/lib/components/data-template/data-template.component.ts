import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTypeTemplateComponent } from '../data-type-template/data-type-template.component';
import { CrownIconComponent } from '../../icons/crown-icon';

@Component({
    selector: 'sau-data-template',
    templateUrl: './data-template.component.html',
    styleUrls: ['./data-template.component.scss'],
    imports: [
        CommonModule,
        DataTypeTemplateComponent,
        CrownIconComponent
    ]
})
export class DataTemplateComponent {
    @Input() item!: any;
    @Input() header!: any;
    @Input() customTemplates: { [key: string]: TemplateRef<any> } = {};

    getCustomTemplate(key: string): TemplateRef<any> | undefined {
        return this.customTemplates ? this.customTemplates[key] : undefined;
    }

    getValue(item: any, key: string | string[]) {
        let arrayKey = [];

        if (!Array.isArray(key)) {
            arrayKey.push(key);
        } else {
            arrayKey = key.slice();
        }

        let result = ''

        while (arrayKey.length > 0) {

            let keys = arrayKey[0].split('.');
            let value = item;

            if (keys[0].includes('[]')) {
                let arrayKey = keys[0].replace('[]', '');

                value = value[arrayKey].map((element: any) => this.getValue(element, keys.slice(1).join('.'))).join(', ');

            } else {
                let finalValue = item[String(key)]

                let isArray = Array.isArray(finalValue)
                let isBoolean = typeof finalValue === 'boolean'
                let isNumber = typeof finalValue === 'number'

                if (isArray || isBoolean || isNumber) {
                    return finalValue
                }

                for (let i = 0; value && i < keys.length; i++) {
                    value = value[keys[i]];
                }

                result = value;

            }

            arrayKey.shift();
        }

        return result;
    }
}
