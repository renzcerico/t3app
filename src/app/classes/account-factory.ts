import { Injectable } from '@angular/core';
import { HeaderService } from '../services/header.service';
import Account from './account';

@Injectable()
export class AccountFactory {
    constructor(private headerService: HeaderService) {}
    public setAccount(jsonObj) {
        return new Account(jsonObj, this.headerService);
    }
}
