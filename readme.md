# `duffy` = [`du(1)`](https://linux.die.net/man/1/du) + [`diffy`](https://npm.im/diffy)

```
npm install -g duffy
duffy <directory> [-n <limit>]
```

Rapidly find the largest files in a given directory.

This is kind of like running the shell command

```
du -ah <directory> | sort -rh | head -n 10
```

to find the largest files in a directory, except that you don't have to wait for `du` to finish: the list of biggest files gets updated in real time as it runs.

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

## Examples

How to find the largest files in the current directory:

```
duffy
```

How to find the 10 largest files on disk:

```
duffy -n 10 /
```

## License

ISC © 2019 harry lachenmayer
