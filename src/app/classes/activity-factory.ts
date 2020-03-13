import { MaterialService } from './../services/material.service';
import Activity from './activity';
import { Injectable } from '@angular/core';

@Injectable()
export class ActivityFactory {
    constructor(private materialService: MaterialService) {}
    public createActivity(jsonObj) {
        return new Activity(jsonObj, this.materialService);
    }
}
