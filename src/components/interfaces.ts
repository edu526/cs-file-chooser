
export interface ICsLocalStorageFile {
	/**
     * Entry is a file.
     */
	isFile: boolean;
    /**
     * Entry is a directory.
     */
	isDirectory: boolean;
	/**
	 * The name of the entry, excluding the path leading to it.
	 */
	name: string;
    /**
     * The full absolute path from the root to the entry.
     */
	fullPath: string;
    /**
     * an alternate URL which can be used by native webview controls, for example media players.
     */
	nativeURL: string;
	/**
     * Preview a file
     */
	thumbnail?: string;
	/**
     * True when selected. Default: false
     */
	isSelected?: boolean;
	lazyLoad?: string;
}
export interface ICsOptionsFile {
	/**
	 * Show hidden system files. Default: false
	 */
	showHiddenFiles?: boolean;
	/**
	 * Maximum number of selectable files. Default: 999
	 */
	maxFiles?: number;
	/**
	 * Allow extensions. Higher priority than blacklist
	 */
	whiteList?: string[];
	/**
	 * Deny extensions
	 */
	blackList?: string[];
	/**
	 * Show files by type: grid - list. Default GRID
	 */
	type?: string;
	/**
	 * Show preview image. Default false [DEV]
	 */
	previewImage?: boolean;
	/**
	 * Color Toolbar. Default 'primary'
	 */
	colorToolbar?: string;
	/**
	 * Show only documents files. Default false
	 */
	onlyDocuments?: boolean;
}
