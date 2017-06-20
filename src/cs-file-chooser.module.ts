import { NgModule, ModuleWithProviders } from '@angular/core';
import { File } from '@ionic-native/file';
import { IonicModule } from 'ionic-angular';

import { CsFileChooserController } from './cs-file-chooser.controller';
import { CsFileChooserProvider } from './providers/cs-file-chooser.provider';

import { CsFileChooserPage } from './components/cs-file-chooser';
import { CsFileChooserPopover } from './components/cs-file-chooser.popover';

@NgModule({
	declarations: [
		CsFileChooserPage,
		CsFileChooserPopover
	],
	imports: [
		IonicModule
	],
	entryComponents: [
		CsFileChooserPage,
		CsFileChooserPopover
	],
	exports: [
		CsFileChooserPage,
		CsFileChooserPopover
	]
})
export class CsFileChooserModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: CsFileChooserModule,
			providers: [
				CsFileChooserProvider,
				CsFileChooserController,
				File
			]
		};
	}
}
