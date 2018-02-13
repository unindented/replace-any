# replace-any

Flexible string replacement.


## Installation

Add the dependency to your project:

```
$ npm install --save-dev replace-any
```


## Usage

You can use `replaceAny` to replace parts of a string with anything you want: other strings, objects, even JSX elements!

You just need to pass two arguments:

1. An array of replacers, where each replacer specifies a regular expression to execute and a function that produces the replacement
2. The string you want to replace

You'll get back an array with the results of applying all your replacers:

```js
import { replaceAny } from 'replace-any';

const lineBreakReplacer = {
  regexp: new RegExp('\\n', 'gi'),
  replace: (key) => <br key={key} />,
};

const linkReplacer = {
  regexp: new RegExp('https?://[^\\s]+', 'gi'),
  replace: (key, text) => <a key={key} href={text}>{text}</a>
};

const replacers = [lineBreakReplacer, linkReplacer]
const processMessage = (body) => replaceAny(replacers, body);

processMessage('Hi there!\n\nGo to https://www.github.com and star this project!')
// [
//   "Hi there!",
//   <br />,
//   <br />,
//   "Go to ",
//   <a href="https://www.github.com">https://www.github.com</a>,
//   " and star this project!"
// ]
```

You can then use this in your React components:

```js
import React, { Component } from 'react';

class Message extends Component {
  render() {
    return (
      <div className="Message">
        {processMessage(this.props.body)}
      </div>
    )
  }
}
```


## Meta

* Code: `git clone git://github.com/unindented/replace-any.git`
* Home: <https://github.com/unindented/replace-any/>


## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))


## License

Copyright (c) 2018 Daniel Perez Alvarez ([unindented.org](https://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
