# atom-auto-programming package

Provide statistical complements for git project.
Uses the
[autocomplete-plus](https://github.com/atom-community/autocomplete-plus) package.

![](https://i.gyazo.com/c00485f40f1aaaf0e063cbf4e15f12d3.gif)

## How To Use

Write some code and run `autocomplete-plus` manually.
You will get candidates of next line of the code.

For example, when you type `use stri`, the code you want to get is `use strict;`, and the next line is `use warnings`.

`atom-auto-programming` runs `git grep 'use stri'` internally, collect result, and sort by appear count.

## Install

```
apm install atom-auto-programming
```

## Requirements

- Only git projects are supported.
