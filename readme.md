# `duffy` = [`du(1)`](https://linux.die.net/man/1/du) + [`diffy`](https://npm.im/diffy)

> Rapidly find the largest files in a given directory.

```
npm install -g duffy
duffy <directory> [-n <limit>]
```

## Examples

### How to find the largest files in the current directory

```
duffy
```

### How to find the 10 largest files on disk

```
duffy -n 10 /
```

## What is it?

This is kind of like running the shell command [`du`](https://linux.die.net/man/1/du) ("disk usage") like this, to find the largest files in a directory:

```
du -ah <directory> | sort -rh | head -n 10
```

`duffy` is a wrapper around `du` which updates the list of biggest files in real time while the command is running.

This is useful when you are trying to hunt down huge files in large directories or on a slow disk, and you care more about doing it quickly than about `du` exploring absolutely every single file before you can see anything.

By default, it shows as many files as will fit on the screen. You can also specify the number of files that will be shown using `-n`.

The output looks pretty much the same as the human-readable `du` output:

```
$ duffy -n 10
2.45MB    .
2.23MB    ./node_modules
708KB     ./node_modules/level-packager
636KB     ./node_modules/level-packager/node_modules
328KB     ./node_modules/encoding-down
276KB     ./node_modules/encoding-down/node_modules
268KB     ./node_modules/level-mem
232KB     ./node_modules/level-mem/node_modules
192KB     ./node_modules/level-packager/node_modules/abstract-leveldown
192KB     ./node_modules/level-mem/node_modules/abstract-leveldown
```

## Contributions

Pull requests welcome! This is a fairly simple script that I hacked together in a day, so there might be some rough edges. Feel free to fork it to change any of the behavior.

## License

ISC © 2019 harry lachenmayer
