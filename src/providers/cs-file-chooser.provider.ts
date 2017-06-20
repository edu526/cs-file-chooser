import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

import { ICsLocalStorageFile, ICsOptionsFile } from './../components/interfaces';

@Injectable()
export class CsFileChooserProvider {

	private _thumbnailsExt: String[] = [
		'7z', 'ai', 'archive', 'arj', 'avi', 'css',
		'csv', 'dbf', 'doc', 'dwg', 'exe', 'fla',
		'gif', 'html', 'iso', 'jpg', 'js', 'json',
		'mdf', 'mp3', 'mp4', 'nrg', 'pdf', 'png',
		'ppt', 'psd', 'rar', 'rtf', 'svg', 'text',
		'tiff', 'txt', 'unknown', 'xls', 'xml', 'zip'
	]

	private _imagesExt = ['jpg', 'png', 'jpeg', 'svg'];

	thumbnailDirectory = "./assets/file-chooser/";

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
			.then((directories: ICsLocalStorageFile[]) => this._formatData(directories, options));
	}

	backDirectory(currentDir: string, properties?: ICsOptionsFile): Promise<any> {
		if (currentDir.charAt(currentDir.length - 1) === '/') currentDir = currentDir.substring(0, currentDir.length - 1);
		let index = currentDir.lastIndexOf("/");
		let backDir = currentDir.substring(0, index + 1);

		return this.getDirectory(backDir, properties)
			.then(files => {
				return {
					files,
					currentDirectory: backDir || '/'
				};
			});
	}

	private _formatData(directories: ICsLocalStorageFile[], options: ICsOptionsFile): ICsLocalStorageFile[] {
		options.blackList = options.blackList || [];
		options.whiteList = options.whiteList || [];

		if (!options.showHiddenFiles) directories = directories.filter(data => data.name.charAt(0) !== '.');

		if (options.blackList.length) {
			directories = directories.filter(data => {
				if (data.isFile) {
					let index = options.blackList.findIndex(ext => ext === this._getExtensionFile(data.name));
					return (index < 0);
				}
				else return true;
			});
		}

		if (options.whiteList.length) {
			directories = directories.filter(data => {
				if (data.isFile) {
					let index = options.whiteList.findIndex(ext => ext === this._getExtensionFile(data.name));
					return (index > -1);
				}
				else return true;
			});
		}

		directories.map(directory => this._getThumbnail(directory))

		return directories;
	}

	private _getThumbnail(data: ICsLocalStorageFile): ICsLocalStorageFile {
		if (data.isDirectory) data.thumbnail = `${this.thumbnailDirectory}folder.svg`;
		else {
			let extTmp = this._getExtensionFile(data.name);
			let isImage = this._imagesExt.findIndex(ext => ext.toLowerCase() === extTmp.substring(0, ext.length).toLowerCase());
			// if (isImage < 0) {
			let ext = this._thumbnailsExt.find(thumbnailExt => thumbnailExt.toLowerCase() === extTmp.substring(0, thumbnailExt.length).toLowerCase());
			if (ext) data.thumbnail = `${this.thumbnailDirectory}${ext}.svg`;
			else data.thumbnail = `${this.thumbnailDirectory}unknown.svg`;
			// } else {
			// 	data.thumbnail = data.nativeURL;
			// }
			// data.lazyLoad =`${this.thumbnailDirectory}${extTmp}.svg`;
		}
		return data;
	}

	private _getExtensionFile(url: string): string {
		return url.split('.').pop();
	}
}
