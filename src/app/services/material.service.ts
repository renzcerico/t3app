import { Injectable} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import Material from '../classes/material.js';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materialsSource = new Subject<Array<Material>>();
  materials$ = this.materialsSource.asObservable();
  materials: Array<Material>;
  constructor() {
    this.materials$.subscribe(
      materials => {
        this.materials = materials;
      }
    );
  }

  setMaterials(materials: Array<any>) {
    const materialsArr = [];
    materials.forEach(element => {
        const material = new Material(element);
        materialsArr.push(material);
    });
    this.materialsSource.next(materialsArr);
  }

  maxBoxQty() {
    let maxBoxQty = 0;
    if ( Object.entries(this.materials).length > 0 ) {
      this.materials.forEach(material => {
        if ( material.ITEM_CATEGORY === 'BOX' && material.MAX_QTY > maxBoxQty ) {
          maxBoxQty = material.MAX_QTY;
        }
      });
    }
    return maxBoxQty;
  }

}
