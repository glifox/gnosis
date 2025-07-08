export const text = `
GNOSIS is an extension-pack for codemirror to support WYSIWYG markdown edition. (WYSIWYG markdown) (codemirror markdown plugin)(WYSIWYG codemirror)

## Documentation

### Installation
~~~bash
npm install @glifox/gnosis
~~~

### Minimal setup
~~~javascript
import {EditorView, minimalSetup} from "codemirror"
import { EditorState } from "@codemirror/state";

import { gnosis } from "@glifox/gnosis";

const editor = new EditorView({
    doc: "text",
    extensions: [
        minimalSetup,
        EditorView.lineWrapping,
        gnosis(),
    ],
    parent: document.querySelector(".editor")
});
~~~

## TO-DO

### **Block-level**
- [x] change: \`paragraph\`
- [x] change: \`heading\`
- [x] change: \`hr\`
- [x] change: \`list\`
    - [x] change: \`listitem\`
    - [x] change: \`checkbox\`
- [x] change: \`code\`
- [ ] change: \`html\`
- [ ] change: \`blockquote\`
- [ ] change: \`table\`

### **Inline-level**
- [x] change: \`strong\`
- [x] change: \`em\`
- [x] change: \`codespan\`
- [ ] change: \`br\`
- [x] change: \`del\`
- [x] change: \`link\`
- [x] change: \`image\`
- [x] change: \`text\`
- [ ] change: \`tags\`

### Features
- [x] change the way mk shows.
- [x] Auto complete list enters 
    - [x] Bulleds
    - [x] ++ Numeric
    - [x] doble enter -- indent
- [x] Code highliting


## ~~This is based on~~

- [codemirror](https://codemirror.net/)
- [lang-markdown](https://github.com/codemirror/lang-markdown)
- [catpuccin](https://catppuccin.com/)

## Examples

***nested marks***

    ***CodeBlock***

### images

img: ![imagen](https://avatars.githubusercontent.com/u/116177764?v=4) this is how the line works.

[![npm](https://badgen.net/npm/v/marked)](https://www.npmjs.com/package/marked) [![install size](https://badgen.net/packagephobia/install/marked)](https://packagephobia.now.sh/result?p=marked) [![downloads](https://badgen.net/npm/dt/marked)](https://www.npmjs.com/package/marked) [![github actions](https://github.com/markedjs/marked/workflows/Tests/badge.svg)](https://github.com/markedjs/marked/actions) [![snyk](https://snyk.io/test/npm/marked/badge.svg)](https://snyk.io/test/npm/marked)

## Html block

<a href="https://marked.js.org">
<img width="60px" height="60px" src="https://marked.js.org/img/logo-black.svg" align="right" />
</a>

## Html inline

<a><img width="60px" height="60px" src="https://marked.js.org/img/logo-black.svg" align="right" /></a>

#### con ~

   ~~~python
   # estas son varias
   # lineas
   class person:
     def __init__(self):
       self.example = true
   
   # en python 
   ~~~

## blockquote

> oneline block quote

> [!Note]
> # This is a note blockquote

> [!Warning]
> # this is a 2 level blockquote
> 
> some text in the block quote
> this text is another line
> 
> > [!error]
> > ## this is the second level for the blockquote
> > 
> > some description for the blockquote
> > 
> spaces (7):
>        
> 
> ~~~python
> codeblock?
> ~~~
> 

### con \`

\`\`\`markdown
# mas lineas con markdown

- Si markdown dentro de markdown
\`\`\`

pero entonces

# Un titulo #tag
## Un titulo
### Un titulo
#### Un titulo
##### Un titulo
###### Un titulo

# Aqui hay algunos tags: \'

#prueba
#resplnador #claro-que_si
#esperanza #depronto 

esto no es un titulo
`
