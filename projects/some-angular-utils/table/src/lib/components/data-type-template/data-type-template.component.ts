import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CheckIconComponent } from '../../icons/check-icon';
import { XmarkIconComponent } from '../../icons/xmark-icon';
import { EnvelopeIconComponent } from '../../icons/envelope-icon';
import { GoogleIconComponent } from '../../icons/google-icon';

@Component({
    selector: 'sau-data-type-template',
    templateUrl: './data-type-template.component.html',
    styleUrls: ['./data-type-template.component.scss'],
    imports: [
        CommonModule,
        DatePipe,
        RouterModule,
        CheckIconComponent,
        XmarkIconComponent,
        EnvelopeIconComponent,
        GoogleIconComponent
    ]
})
export class DataTypeTemplateComponent {
    @Input() item!: any;
    @Input() header!: any;
    @Input() value!: string | string[];

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

    getLink(pattern: string = '{key}', item: any, value: string | string[]): { url: string, isExternal: boolean } {
        const keyValue = this.getValue(item, value);
        const url = pattern.replace('{key}', keyValue);
        const isExternal = url.startsWith('http://') || url.startsWith('https://')

        return {
            url,
            isExternal
        }
    }
}
