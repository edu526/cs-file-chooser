# FILE CHOOSER for Ionic 3

To see this in action, checkout the [example project here](https://github.com/edu526/cs-file-chooser-example).


[![NPM](https://nodei.co/npm/cs-file-chooser.png?stars&downloads)](https://nodei.co/npm/cs-file-chooser/)
[![NPM](https://nodei.co/npm-dl/cs-file-chooser.png?months=6&height=2)](https://nodei.co/npm/cs-file-chooser/)

- [Installation](#installation)
- [Usage](#usage)
  - [`CsFileChooserController` Provider](#cs-file-chooser-controller-provider)
- [Examples](#examples)

<br>

# Installation
## Install the module via NPM
```shell
npm i --save cs-file-chooser
```
## Import it in your app's module(s)

Import `CsFileChooserModule.forRoot()` in your app's main module

```ts
import { CsFileChooserModule } from 'cs-file-chooser';

@NgModule({
    ...
    imports: [
      ...
      CsFileChooserModule.forRoot()
      ],
    ...
})
export class AppModule {}
```

# Usage

## `CsFileChooserController` Provider

### openCsFileChoooser
```ts
openCsFileChoooser(options?: ICsOptionsFile): Observable<any>
```
#### OPTIONS

_(optional)_ Advanced configuration.

Param | Type | Description | Default
--- | --- | --- | ---
`showHiddenFiles` | boolean |Show hidden system files. | `false`
`maxFiles` | number | Maximum number of selectable files. | `999`
`whiteList` | String[] | Allow extensions. | `[]`
`blackList` | String[] |Deny extensions. | `[]`
`type` | String | Show files: `'grid'`, `'list'`. | `grid`
`previewImage` | boolean | Show preview image. [DEV] | `false`

### Return

#### `Object`
```ts
{
  nativeURLs: [...]
}
```
Array of nativeURLs (String)
# Examples
## Simple Example
```ts
import { Component } from '@angular/core';
import { CsFileChooserController } from 'cs-file-chooser';

@Component({
  selector: 'test-page',
  templateUrl: './test.html'
})

export class TestPage {

  constructor(
    private _csFileChooserCtrl: CsFileChooserController
  ) {}

  openFileChooser() {
    this._csFileChooserCtrl.openCsFileChoooser()
      .subscribe(data => {
        console.log(data);
      });
  }
}
```
## Example with all options
```ts
import { Component } from '@angular/core';
import { CsFileChooserController } from 'cs-file-chooser';

@Component({
  selector: 'test-page',
  templateUrl: './test.html'
})

export class TestPage {

  constructor(
    private _csFileChooserCtrl: CsFileChooserController
  ) {}

  openFileChooser() {
    let options = {
      showHiddenFiles: true,
      maxFiles: 10,
      whiteList: ['png','jpg','mp4'],
      blackList: ['pdf','docx','doc'],
      type: 'list'
    };
    this._csFileChooserCtrl.openCsFileChoooser(options)
      .subscribe(data => {
        console.log(data);
      });
  }
}
```
<br><br>
## Contribution
- **Having an issue**? or looking for support? [Open an issue](https://github.com/edu526/cs-file-chooser/issues/new) and we will get you the help you need.
- Got a **new feature or a bug fix**? Fork the repo, make your changes, and submit a pull request.

## Support this project
If you find this project useful, please star the repo to let people know that it's reliable. Also, share it with friends and colleagues that might find this useful as well. Thank you :smile:

<br><br>

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/EduardoDelaCruzRojas)
