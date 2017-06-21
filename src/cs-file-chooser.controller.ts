import { CsFileChooserPage } from './components/cs-file-chooser';
import { ICsOptionsFile } from './components/interfaces';
import { ModalController } from 'ionic-angular';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CsFileChooserController {

	private _subscriber: EventEmitter<string[]>;

	constructor(
		private _modalCtrl: ModalController
	) {
		this._subscriber = new EventEmitter<string[]>();
	}

	openCsFileChoooser(options?: ICsOptionsFile): Observable<any> {
		return Observable.create(observable => {
			let modal = this._modalCtrl.create(CsFileChooserPage, options);
			modal.onDidDismiss(data => {
				observable.next(data);
				observable.complete();
			});
			modal.present();
		});
	}
}
