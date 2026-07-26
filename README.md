# gnosis
[![Publish Web App](https://github.com/glifox/gnosis/actions/workflows/Pages.yml/badge.svg)](https://github.com/glifox/gnosis/actions/workflows/Pages.yml)

_GNOSIS_ is an extension-pack for codemirror to support WYSIWYG markdown edition. 

## Why another **_WYSIWYG_ markdown editor**?

I did a lot of online research, and found some _WYSIWYG markdown editors_. However, none of the Open Source options seemed good enough. The  **Obsidian** editor is nice but not Open Source... _So I decided to start a new project_.

## Similar projects

1. [Inoxia](https://ixora.karawale.in/)
2. [Silverbullet](https://silverbullet.md/)
3. [Markword](https://github.com/fuermosi777/markword)

## TO-DO

### **Block-level**
- [ ] change: `paragraph`
- [x] change: `heading`
- [ ] change: `hr`
- [ ] change: `list` (WIP)
    - [x] change: `listitem`
    - [ ] change: `numbers`
    - [x] change: `checkbox`
- [ ] change: `code`
    - [ ] add a custom scroller to avoid line wrapps on codeblock
    - [ ] add an option to line-wrapp inside codeblocks
- [ ] change: `html`
- [x] change: `blockquote` (WIP)
    - [x] support for [github quotes highlight](https://github.com/orgs/community/discussions/16925)
    - [ ] margin left when the number of quotemarks is inferior to the depth. _this needs to also be taking into account on the breaks pluggin_.
    - [ ] use shades to difrent depths to allow clarifing the gerarquy to the user
- [ ] change: `table` (added maybe from other project)

### **Inline-level**
- [x] change: `strong`
- [x] change: `em`
- [x] change: `codespan`
- [ ] change: `br` _inline html_.
- [x] change: `del`
- [ ] change: `link`
- [ ] change: `image`
    - [ ] for inline images large enough, add a refrence widget in the text as `see image: alt-text` and render the image as a blockWigeth on the next line
- [ ] change: `tags`

### Features
- [x] hide marks when written.
- [x] reduce the flickering when _marks toggle_. (WIP)
- [x] custom line breaks using **pretext** (WIP - alpha)
- [ ] Code highliting
- [ ] keybinds
    - [ ] Auto complete list on enter 
        - [ ] auto add bullet on bullet-list
        - [ ] increase number on numered-list
        - [ ] doble enter reduce indentation "_un-nest list item_"
        - [ ] tab add identation "_nest list item_"

## More ideas?

Feel free to open an [issue](https://github.com/feraxhp/gnosis/issues) 
requesting new features.
