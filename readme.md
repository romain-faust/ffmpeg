# @romain-faust/ffmpeg

Set of tools for interacting with [ffmpeg](https://www.ffmpeg.org/).

## Installation

_With NPM:_

```bash
npm install @romain-faust/ffmpeg rxjs
```

_With Yarn:_

```bash
yarn add @romain-faust/ffmpeg rxjs
```

## Usage

<!-- prettier-ignore -->
```ts
import { transcode } from '@romain-faust/ffmpeg'

transcode({
    audioFormat: 'aac',
    inputPath: '/path/to/the/input/file',
    outputFormat: 'matroska',
    outputPath: '/path/to/the/output/file',
    subTitleFormat: 'srt',
    videoFormat: 'libx265',
}).subscribe({
    next(event) {
        console.log(`Transcoded ${event.current} ms out of ${event.total}.`)
    },
    error(error) {
        console.error(`An error occurred: ${error.message}.`)
    },
    complete() {
        console.log('Transcode succeed.')
    },
})
```

## License

[MIT](./license.md)
