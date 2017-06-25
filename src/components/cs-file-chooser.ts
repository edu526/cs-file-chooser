import { CsFileChooserPopover } from './cs-file-chooser.popover';
import { CsFileChooserProvider } from './../providers/cs-file-chooser.provider';
import { ICsLocalStorageFile, ICsOptionsFile } from './interfaces';
import { Component, ViewChild, HostListener } from '@angular/core';
import { ViewController, Platform, NavParams, Content, PopoverController } from 'ionic-angular';


@Component({
	selector: 'cs-file-chooser-page',
	template: getTemplate(),
	styles: getStyles()
})
export class CsFileChooserPage {


	@ViewChild('CsScroll') content: Content;
	currentDirectory: string = "/";

	files: ICsLocalStorageFile[] = [];
	selectedFileItems: string[] = [];
	isRoot: boolean = true;
	mode: string;
	colorToolbar: string;
	onlyDocuments: boolean;
	private _historyPosition: number[] = [];
	private _tmpPosition: number = 0;
	private _backDirectory: string = '/';
	private _options: ICsOptionsFile;
	private _isBack: boolean;

	constructor(
		private _fileSrv: CsFileChooserProvider,
		private _platform: Platform,
		private _viewCtrl: ViewController,
		private _navParams: NavParams,
		private _popoverCtrl: PopoverController
	) {
	}
	ngOnInit() {
		this._getParams();
		if (!this._options.onlyDocuments) this._openDirectory();
		else {
			this._fileSrv.documentsObserver
				.subscribe(file => {
					if (file) this.files.push(file);
				});
			this._documentsDirectory();
		}

		this._platform.registerBackButtonAction(() => this.backDirectory());
	}

	private _getParams() {
		this._options = this._navParams.data || {};
		this._options.type = this._options.type || 'grid'
		this.mode = this._options.type;
		this.colorToolbar = this._options.colorToolbar || 'primary'
		this.onlyDocuments = this._options.onlyDocuments;
	}

	ngAfterViewInit() {
		this.content.ionScroll
			.subscribe(event => this._tmpPosition = event.scrollTop)
	}

	fileSelected(fileSelected: ICsLocalStorageFile) {
		if (fileSelected.isFile) {

			let index = this.files.findIndex(file => file.nativeURL === fileSelected.nativeURL);
			if (!this.files[index].isSelected) {
				if (this.selectedFileItems.length < (this._options.maxFiles || 999)) {
					this.files[index].isSelected = true;
					this.selectedFileItems.push(this.files[index].nativeURL);
				}
			}
			else {
				this.files[index].isSelected = false;
				let ind = this.selectedFileItems.findIndex(file => file === fileSelected.nativeURL);
				this.selectedFileItems.splice(ind, 1);
			}
		} else {
			this._backDirectory = this.currentDirectory;
			this.currentDirectory = fileSelected.fullPath;
			this.isRoot = false;
			this._openDirectory(fileSelected.fullPath);
		}
	}

	isSelected(): void {
		this.files.forEach(file => {
			let item = this.selectedFileItems.find(url => url === file.nativeURL);
			file.isSelected = (item) ? true : false;
		})
	}

	backDirectory(): void {
		if (this.currentDirectory === '/') {
			this.close();
		} else {
			this._fileSrv.backDirectory(this.currentDirectory, this._options)
				.then(data => {
					this._isBack = true;
					this.files = data.files;
					this.currentDirectory = data.currentDirectory;
					this.isRoot = (this.currentDirectory === '/') ? true : false;
					this.isSelected();
				});
		}
	}

	done() {
		this._viewCtrl.dismiss({ nativeURLs: this.selectedFileItems });
	}

	close() {
		this._viewCtrl.dismiss({ nativeURLs: [] });
	}


	scrollBotton(num) {
		if (num === this.files.length - 1 && this._historyPosition.length && this._isBack) {
			let newPosition = this._historyPosition.pop();
			this._isBack = false;
			if (newPosition) this.content.scrollTo(0, newPosition, 0);
		}
	}

	openOptions(myEvent) {
		let hiddenFiles = this._options.showHiddenFiles;
		let popover = this._popoverCtrl.create(CsFileChooserPopover, { options: this._options });
		popover.onDidDismiss(options => {
			this._options = options || this._options;
			this.mode = this._options.type;
			if (hiddenFiles !== this._options.showHiddenFiles) this._openDirectory(this.currentDirectory);
		});
		popover.present({
			ev: myEvent
		});
	}

	private _openDirectory(path?: string): void {
		this._historyPosition.push(this._tmpPosition);
		this._fileSrv.getDirectory(path, this._options)
			.then(files => {
				this.files = files;
				this.isSelected();
			});
	}

	private _documentsDirectory(): void {
		this._fileSrv.getDocuments(this._options);
	}
}

export function getTemplate() {
	return `
		<ion-header>
			<ion-toolbar [color]="colorToolbar">
				<ion-buttons *ngIf="!isRoot" left>
					<button ion-button icon-only (click)="backDirectory()">
						<ion-icon name="arrow-back"></ion-icon>
					</button>
				</ion-buttons>
				<ion-buttons end>
					<button class="cs-button-actions" ion-button (click)="close()">
						Cancel
					</button>
					<button class="cs-button-actions" ion-button (click)="done()">
						Done
					</button>
					<button ion-button icon-only (click)="openOptions($event)" *ngIf="!onlyDocuments">
						<ion-icon name="more"></ion-icon>
					</button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content class="cs-content" #CsScroll>
			<p>{{ currentDirectory }}</p>
			<ion-row *ngIf="mode === 'grid'">
				<ion-col col-4 *ngFor="let file of files, let i = index" (click)="fileSelected(file)">{{ scrollBotton(i) }}<img [src]="file.thumbnail || ''"><span>{{ file.name }}</span><span class="cs-selected" *ngIf="file.isSelected"><ion-icon class="cs-icon" name="checkmark" color="light"></ion-icon></span></ion-col>
			</ion-row>
			<ion-list *ngIf="mode === 'list'">
				<ion-item *ngFor="let file of files, let i = index" (click)="fileSelected(file)">{{ scrollBotton(i) }}
					<ion-thumbnail item-start><img [src]="file.thumbnail || ''"></ion-thumbnail>
					<h2>{{ file.name }}</h2><span class="cs-selected" *ngIf="file.isSelected"><ion-icon class="cs-icon" name="checkmark"></ion-icon></span></ion-item>
			</ion-list>
		</ion-content>
`
}

export function getStyles() {
	return [`
	.cs-selected {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(72, 138, 255, 0.31);
    }
    ion-col {
        position: relative;
    }
    .cs-icon {
        font-size: 50px;
        transform: translate(-50%, -50%);
        position: absolute;
        top: 50%;
        left: 50%;
    }
    .cs-content {
        text-align: center;
    }
    .cs-button-actions {
        padding: 10px;
        margin: 10px;
    }
    img {
        height: 110px;
        width: 110px;
    }
`]
}

