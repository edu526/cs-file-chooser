import { Injectable, EventEmitter } from '@angular/core';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { ICsLocalStorageFile, ICsOptionsFile } from './../components/interfaces';
import * as byteConverter from 'byte-converter';
import * as mime from 'mime-types';

var converter = byteConverter.converterBase2;

@Injectable()
export class CsFileChooserProvider {

	thumbnailDirectory = "./assets/file-chooser/";
	documentsObserver: EventEmitter<ICsLocalStorageFile> = new EventEmitter<ICsLocalStorageFile>();

	private _thumbnailsExt: String[] = [
		'7z', 'ai', 'archive', 'arj', 'avi', 'css',
		'csv', 'dbf', 'doc', 'dwg', 'exe', 'fla',
		'gif', 'html', 'iso', 'jpg', 'js', 'json',
		'mdf', 'mp3', 'mp4', 'nrg', 'pdf', 'png',
		'ppt', 'psd', 'rar', 'rtf', 'svg', 'text',
		'tiff', 'txt', 'unknown', 'xls', 'xml', 'zip'
	];

	private _imagesExt = ['jpg', 'png', 'jpeg', 'svg'];
	private _documentsExt = [
		'doc', 'docs', 'html', 'htm',
		'odt', 'pdf', 'xls', 'xlxs',
		'ods', 'ppt', 'pptx', 'txt'
	];

	private _videosExt = [
		'avi', 'mpeg', 'mov', 'wmv',
		'mp4', 'flv', '3gp'
	];

	constructor(
		private _file: File,
		private _platform: Platform
	) {
	}

	getDirectory(dirName: string, options?: ICsOptionsFile): Promise<ICsLocalStorageFile[]> {
		dirName = dirName || '';
		if (dirName.charAt(0) === '/') dirName = dirName.substr(1);

		let path;
		if (this._platform.is('android')) path = this._file.externalRootDirectory;
		else if (this._platform.is('ios')) path = this._file.documentsDirectory;

		return this._file.listDir(path, dirName)
			.then((directories: ICsLocalStorageFile[]) => this._formatDatas(directories, options));
	}

	backDirectory(currentDir: string, options?: ICsOptionsFile): Promise<any> {
		if (currentDir.charAt(currentDir.length - 1) === '/') currentDir = currentDir.substring(0, currentDir.length - 1);
		let index = currentDir.lastIndexOf("/");
		let backDir = currentDir.substring(0, index + 1);

		return this.getDirectory(backDir, options)
			.then(files => {
				return {
					files,
					currentDirectory: backDir || '/'
				};
			});
	}

	documents: any[] = [];
	promises: any[] = [];

	getDocuments(options: ICsOptionsFile) {
		let paths = [
			this._file.dataDirectory,
			this._file.documentsDirectory,
			this._file.externalRootDirectory,
			this._file.externalDataDirectory,
			this._file.sharedDirectory,
			this._file.syncedDataDirectory
		];
		paths.forEach(path => {
			if (path) this._addFileEntry(path, '', options);
		});
	}

	decodeURIComponent(url: string) {
		return decodeURIComponent(url);
	}

	private _addFileEntry(path: string, dirName: string = '', options: ICsOptionsFile) {
		dirName = dirName || '';
		if (dirName.charAt(0) === '/') dirName = dirName.substr(1);
		if (options.whiteList[0] === 'video') this._documentsExt = this._videosExt;
		if (dirName.indexOf('com.') === -1 && dirName.indexOf('org.') === -1) {
			this._file.listDir(path, dirName)
				.then(entries => {
					entries.forEach(entrie => {
						if (entrie.isDirectory) this._addFileEntry(path, entrie.fullPath, options);
						else {
							let tmp = this._getExtensionFile(entrie.name);
							let index = this._documentsExt.findIndex(ext => tmp === ext);
							if (index > -1) {
								entrie.getMetadata((metaData: any) => {
									metaData = {
										size: converter(metaData.size, 'B', 'MB'),
										sizeType: 'MB',
										mimeType: mime.lookup(entrie.name)
									};
									let file = this._getThumbnail(entrie, options);
									file.metadata = metaData;
									this.documentsObserver.next(file);
								});
							}
						}
					});
				}).catch(error => console.log(error))
		}
	}

	private _formatDatas(directories: ICsLocalStorageFile[], options: ICsOptionsFile): ICsLocalStorageFile[] {
		options.blackList = options.blackList || [];
		options.whiteList = options.whiteList || [];

		if (!options.showHiddenFiles) directories = directories.filter(data => data.name.charAt(0) !== '.');
		if (options.whiteList.length) {
			directories = directories.filter(data => {
				if (data.isFile) {
					let index = options.whiteList.findIndex(ext => ext === this._getExtensionFile(data.name));
					return (index > -1);
				}
				else return true;
			});
		} else if (options.blackList.length) {
			directories = directories.filter(data => {
				if (data.isFile) {
					let index = options.blackList.findIndex(ext => ext === this._getExtensionFile(data.name));
					return (index < 0);
				}
				else return true;
			});
		}

		directories.map(directory => this._getThumbnail(directory, options))

		return directories;
	}

	private _getThumbnail(data: ICsLocalStorageFile, options: ICsOptionsFile): ICsLocalStorageFile {
		if (data.isDirectory) data.thumbnail = `${this.thumbnailDirectory}folder.svg`;
		else {
			let extTmp = this._getExtensionFile(data.name);
			let isImage = this._imagesExt.findIndex(ext => ext.toLowerCase() === extTmp.substring(0, ext.length).toLowerCase());

			if (options.previewImage) {
				if (isImage < 0) {
					let ext = this._thumbnailsExt.find(thumbnailExt => thumbnailExt.toLowerCase() === extTmp.substring(0, thumbnailExt.length).toLowerCase());
					if (ext) data.thumbnail = `${this.thumbnailDirectory}${ext}.svg`;
					else data.thumbnail = `${this.thumbnailDirectory}unknown.svg`;
				} else {
					data.thumbnail = data.nativeURL;
				}
				data.lazyLoad = `${this.thumbnailDirectory}${extTmp}.svg`;
			} else {
				let ext = this._thumbnailsExt.find(thumbnailExt => thumbnailExt.toLowerCase() === extTmp.substring(0, thumbnailExt.length).toLowerCase());
				if (ext) data.thumbnail = `${this.thumbnailDirectory}${ext}.svg`;
				else data.thumbnail = `${this.thumbnailDirectory}unknown.svg`;
			}
		}
		return data;
	}

	private _getExtensionFile(url: string): string {
		let i = url.split('.').length;
		return (i > 1) ? url.split('.').pop() : '';
	}
}
