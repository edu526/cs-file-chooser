import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { ICsOptionsFile } from './interfaces';

@Component({
	template: `
    <ion-list>
      	<button ion-item (click)="close('hiddenFiles')"> {{ _showFileText }} hidden Files</button>
      	<button ion-item (click)="close('view')">View {{ _showFileView }}</button>
    </ion-list>
  `
})
export class CsFileChooserPopover {
	private _options: ICsOptionsFile = {};
	private _showFileText: string = '';
	private _showFileView: string = '';

	constructor(
		private _viewCtrl: ViewController,
		private _navParams: NavParams
	) {
		this._options = this._navParams.get('options');
		this._showFileText = (this._options.showHiddenFiles) ? 'Hide' : 'Show';
		this._showFileView = (this._options.type === 'grid') ? 'list' : 'grid';
	}

	close(options) {
		if (options === 'hiddenFiles') {
			this._options.showHiddenFiles = !this._options.showHiddenFiles;
		} else if (options === 'view') {
			this._options.type = this._showFileView;
		}
		this._viewCtrl.dismiss(this._options);
	}
}
