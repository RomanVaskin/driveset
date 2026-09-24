#!/usr/bin/env node

import { createHash, randomBytes } from 'node:crypto'
import { spawn } from 'node:child_process'
import {
  access,
  mkdir,
  mkdtemp,
  open,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import { constants as fsConstants } from 'node:fs'
import { basename, delimiter, dirname, extname, join, relative, resolve, sep } from 'node:path'
import { tmpdir } from 'node:os'

const PIPELINE_VERSION = 1
const DEFAULT_INPUT = '/opt/olnoo/media/driveset/portfolio'
const DEFAULT_OUTPUT = '/opt/olnoo/media/driveset/portfolio-web'
const DEFAULT_PUBLIC_BASE = '/media/portfolio-web'
const CATEGORIES = ['wrapping', 'polishing', 'dry-cleaning']
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.heic'])
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov'])

function usage() {
  return `Usage: node scripts/process-portfolio-media.mjs [options]

Options:
  --input <path>        Source root (default: ${DEFAULT_INPUT})
  --output <path>       Derivative root (default: ${DEFAULT_OUTPUT})
  --public-base <path>  Public URL prefix (default: ${DEFAULT_PUBLIC_BASE})
  --help                Show this help
`
}

function parseArguments(argv) {
  const options = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    publicBase: DEFAULT_PUBLIC_BASE,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--') continue
    if (argument === '--help') {
      process.stdout.write(usage())
      process.exit(0)
    }

    const key = argument === '--input'
      ? 'input'
      : argument === '--output'
        ? 'output'
        : argument === '--public-base'
          ? 'publicBase'
          : null

    if (!key || !argv[index + 1]) {
      throw new Error(`Unknown or incomplete argument: ${argument}`)
    }

    options[key] = argv[index + 1]
    index += 1
  }

  options.input = resolve(options.input)
  options.output = resolve(options.output)
  options.publicBase = `/${options.publicBase.replace(/^\/+|\/+$/g, '')}`
  return options
}

function assertSafeRoots(inputRoot, outputRoot) {
  if (inputRoot === outputRoot || outputRoot.startsWith(`${inputRoot}${sep}`)) {
    throw new Error('Output directory must not be the source directory or a child of it')
  }
  if (inputRoot === sep || outputRoot === sep) {
    throw new Error('Filesystem root cannot be used as an input or output directory')
  }
}

async function canonicalPath(path) {
  if (await exists(path)) return realpath(path)
  const missingSegments = []
  let existingAncestor = path
  while (!await exists(existingAncestor)) {
    const parent = dirname(existingAncestor)
    if (parent === existingAncestor) throw new Error(`Cannot resolve path: ${path}`)
    missingSegments.unshift(basename(existingAncestor))
    existingAncestor = parent
  }
  return join(await realpath(existingAncestor), ...missingSegments)
}

async function exists(path) {
  try {
    await access(path, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

async function run(command, args, { capture = false } = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'ignore', 'pipe'],
    })
    let stdout = ''
    let stderr = ''

    if (capture) {
      child.stdout.setEncoding('utf8')
      child.stdout.on('data', (chunk) => {
        stdout += chunk
      })
    }
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', rejectPromise)
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise(stdout)
        return
      }
      rejectPromise(new Error(`${command} exited with code ${code}: ${stderr.trim()}`))
    })
  })
}

async function commandAvailable(command) {
  const directories = (process.env.PATH ?? '').split(delimiter).filter(Boolean)
  for (const directory of directories) {
    try {
      await access(join(directory, command), fsConstants.X_OK)
      return true
    } catch {
      // Try the next PATH entry.
    }
  }
  return false
}

async function walk(directory) {
  const files = []
  const entries = await readdir(directory, { withFileTypes: true })
  entries.sort((left, right) => left.name.localeCompare(right.name, 'en'))

  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walk(path))
    } else if (entry.isFile()) {
      files.push(path)
    }
  }

  return files
}

async function discoverSources(inputRoot) {
  const sources = []
  for (const category of CATEGORIES) {
    const categoryRoot = join(inputRoot, category)
    if (!await exists(categoryRoot)) {
      console.warn(`[warn] Category directory is missing: ${categoryRoot}`)
      continue
    }

    for (const path of await walk(categoryRoot)) {
      const extension = extname(path).toLowerCase()
      const type = IMAGE_EXTENSIONS.has(extension)
        ? 'image'
        : VIDEO_EXTENSIONS.has(extension)
          ? 'video'
          : null
      if (!type) continue

      const relativePath = relative(categoryRoot, path).split(sep).join('/')
      sources.push({ category, categoryRoot, extension, path, relativePath, type })
    }
  }

  return sources
}

function stableStem(source) {
  const rawStem = basename(source.path, extname(source.path))
  const readable = rawStem
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'media'
  const hash = createHash('sha256')
    .update(`${source.category}/${source.relativePath}`)
    .digest('hex')
    .slice(0, 10)
  return `${readable}-${hash}`
}

function publicPath(publicBase, category, filename) {
  return `${publicBase}/${category}/${encodeURIComponent(filename)}`
}

function outputPaths(source, outputRoot, publicBase) {
  const stem = stableStem(source)
  const categoryOutput = join(outputRoot, source.category)

  if (source.type === 'image') {
    const thumbName = `${stem}.thumb.webp`
    const largeName = `${stem}.large.webp`
    return {
      categoryOutput,
      files: {
        thumb: join(categoryOutput, thumbName),
        large: join(categoryOutput, largeName),
      },
      public: {
        thumb: publicPath(publicBase, source.category, thumbName),
        src: publicPath(publicBase, source.category, largeName),
      },
    }
  }

  const videoName = `${stem}.mp4`
  const posterName = `${stem}.poster.webp`
  return {
    categoryOutput,
    files: {
      video: join(categoryOutput, videoName),
      poster: join(categoryOutput, posterName),
    },
    public: {
      src: publicPath(publicBase, source.category, videoName),
      poster: publicPath(publicBase, source.category, posterName),
    },
  }
}

function temporarySibling(finalPath) {
  const extension = extname(finalPath)
  const withoutExtension = finalPath.slice(0, -extension.length)
  return `${withoutExtension}.${process.pid}.${randomBytes(4).toString('hex')}.tmp${extension}`
}

async function probe(path) {
  const output = await run('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=format_name,duration:stream=index,codec_type,codec_name,pix_fmt,width,height',
    '-of', 'json',
    path,
  ], { capture: true })
  return JSON.parse(output)
}

function videoStream(probeResult) {
  return probeResult.streams?.find((stream) => stream.codec_type === 'video')
}

function audioStreams(probeResult) {
  return probeResult.streams?.filter((stream) => stream.codec_type === 'audio') ?? []
}

async function validateWebp(path, maxDimension) {
  if (!await exists(path)) return false
  const fileStat = await stat(path)
  if (!fileStat.isFile() || fileStat.size === 0) return false

  try {
    const result = await probe(path)
    const stream = videoStream(result)
    return stream?.codec_name === 'webp'
      && Number(stream.width) > 0
      && Number(stream.height) > 0
      && Math.max(Number(stream.width), Number(stream.height)) <= maxDimension
  } catch {
    return false
  }
}

async function hasFastStart(path) {
  const handle = await open(path, 'r')
  try {
    const fileStat = await handle.stat()
    let position = 0

    while (position + 8 <= fileStat.size) {
      const header = Buffer.alloc(16)
      const { bytesRead } = await handle.read(header, 0, 16, position)
      if (bytesRead < 8) return false

      let boxSize = header.readUInt32BE(0)
      const boxType = header.toString('ascii', 4, 8)
      let headerSize = 8
      if (boxSize === 1) {
        if (bytesRead < 16) return false
        const extendedSize = header.readBigUInt64BE(8)
        if (extendedSize > BigInt(Number.MAX_SAFE_INTEGER)) return false
        boxSize = Number(extendedSize)
        headerSize = 16
      } else if (boxSize === 0) {
        boxSize = fileStat.size - position
      }

      if (boxSize < headerSize || position + boxSize > fileStat.size) return false
      if (boxType === 'moov') return true
      if (boxType === 'mdat') return false
      position += boxSize
    }

    return false
  } finally {
    await handle.close()
  }
}

async function validateVideo(path) {
  if (!await exists(path)) return false
  const fileStat = await stat(path)
  if (!fileStat.isFile() || fileStat.size === 0) return false

  try {
    const result = await probe(path)
    const video = videoStream(result)
    const audio = audioStreams(result)
    const formatNames = String(result.format?.format_name ?? '').split(',')
    return formatNames.includes('mp4')
      && video?.codec_name === 'h264'
      && video?.pix_fmt === 'yuv420p'
      && audio.every((stream) => stream.codec_name === 'aac')
      && await hasFastStart(path)
  } catch {
    return false
  }
}

function stateMatches(entry, sourceStat) {
  return entry?.pipelineVersion === PIPELINE_VERSION
    && entry.sourceSize === sourceStat.size
    && entry.sourceMtimeMs === sourceStat.mtimeMs
}

async function validateExisting(source, paths, stateEntry, sourceStat) {
  if (!stateMatches(stateEntry, sourceStat)) return false
  if (source.type === 'image') {
    return await validateWebp(paths.files.thumb, 640)
      && await validateWebp(paths.files.large, 1600)
  }
  return await validateVideo(paths.files.video)
    && await validateWebp(paths.files.poster, 1600)
}

function imageScaleFilter(maxDimension) {
  return `scale=w='min(${maxDimension},iw)':h='min(${maxDimension},ih)':force_original_aspect_ratio=decrease`
}

async function encodeWebp(input, output, maxDimension, quality) {
  const rasterTemp = `${output}.png`
  try {
    await run('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-i', input,
      '-vf', imageScaleFilter(maxDimension),
      '-frames:v', '1',
      rasterTemp,
    ])
    await run('cwebp', [
      '-quiet', '-mt', '-preset', 'photo',
      '-q', String(quality),
      rasterTemp,
      '-o', output,
    ])
  } finally {
    await rm(rasterTemp, { force: true }).catch(() => {})
  }
}

async function decodeHeic(input, temporaryDirectory) {
  const requestedOutput = join(temporaryDirectory, 'decoded.png')
  await run('heif-convert', [input, requestedOutput])
  const candidates = (await readdir(temporaryDirectory))
    .filter((name) => /^decoded(?:-\d+)?\.(?:png|jpe?g)$/i.test(name))
    .sort()
  if (candidates.length === 0) {
    throw new Error('heif-convert did not produce a decoded image')
  }
  return join(temporaryDirectory, candidates[0])
}

async function processImage(source, paths) {
  await mkdir(paths.categoryOutput, { recursive: true })
  const thumbTemp = temporarySibling(paths.files.thumb)
  const largeTemp = temporarySibling(paths.files.large)
  let decodedDirectory = null

  try {
    let encoderInput = source.path
    if (source.extension === '.heic') {
      decodedDirectory = await mkdtemp(join(tmpdir(), 'driveset-heic-'))
      encoderInput = await decodeHeic(source.path, decodedDirectory)
    }

    await encodeWebp(encoderInput, thumbTemp, 640, 78)
    await encodeWebp(encoderInput, largeTemp, 1600, 82)

    if (!await validateWebp(thumbTemp, 640) || !await validateWebp(largeTemp, 1600)) {
      throw new Error('Generated WebP validation failed')
    }

    await rename(thumbTemp, paths.files.thumb)
    await rename(largeTemp, paths.files.large)
  } finally {
    await rm(thumbTemp, { force: true }).catch(() => {})
    await rm(largeTemp, { force: true }).catch(() => {})
    if (decodedDirectory) {
      await rm(decodedDirectory, { recursive: true, force: true }).catch(() => {})
    }
  }
}

function isDirectlyCompatibleVideo(source, probeResult) {
  const video = videoStream(probeResult)
  return source.extension === '.mp4'
    && video?.codec_name === 'h264'
    && video?.pix_fmt === 'yuv420p'
    && audioStreams(probeResult).every((stream) => stream.codec_name === 'aac')
}

async function createPoster(videoPath, output, duration) {
  const numericDuration = Number(duration)
  const seek = Number.isFinite(numericDuration) && numericDuration > 0
    ? Math.min(1, numericDuration * 0.1)
    : 0
  const frameTemp = `${output}.png`
  try {
    await run('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-ss', seek.toFixed(3),
      '-i', videoPath,
      '-vf', imageScaleFilter(1600),
      '-frames:v', '1',
      frameTemp,
    ])
    await run('cwebp', [
      '-quiet', '-mt', '-preset', 'photo',
      '-q', '80',
      frameTemp,
      '-o', output,
    ])
  } finally {
    await rm(frameTemp, { force: true }).catch(() => {})
  }
}

async function processVideo(source, paths) {
  await mkdir(paths.categoryOutput, { recursive: true })
  const videoTemp = temporarySibling(paths.files.video)
  const posterTemp = temporarySibling(paths.files.poster)

  try {
    const sourceProbe = await probe(source.path)
    if (!videoStream(sourceProbe)) throw new Error('No video stream found')

    const common = ['-hide_banner', '-loglevel', 'error', '-y', '-i', source.path]
    if (isDirectlyCompatibleVideo(source, sourceProbe)) {
      await run('ffmpeg', [
        ...common,
        '-map', '0:v:0', '-map', '0:a?',
        '-c', 'copy',
        '-movflags', '+faststart',
        videoTemp,
      ])
    } else {
      await run('ffmpeg', [
        ...common,
        '-map', '0:v:0', '-map', '0:a?',
        '-vf', `${imageScaleFilter(1920)}:in_range=auto:out_range=tv,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p`,
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-color_range', 'tv',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-map_metadata', '0',
        videoTemp,
      ])
    }

    const outputProbe = await probe(videoTemp)
    await createPoster(videoTemp, posterTemp, outputProbe.format?.duration)

    if (!await validateVideo(videoTemp) || !await validateWebp(posterTemp, 1600)) {
      throw new Error('Generated video or poster validation failed')
    }

    await rename(videoTemp, paths.files.video)
    await rename(posterTemp, paths.files.poster)
  } finally {
    await rm(videoTemp, { force: true }).catch(() => {})
    await rm(posterTemp, { force: true }).catch(() => {})
  }
}

function manifestItem(source, paths) {
  if (source.type === 'image') {
    return {
      category: source.category,
      type: 'image',
      src: paths.public.src,
      thumb: paths.public.thumb,
      originalFilename: basename(source.path),
    }
  }

  return {
    category: source.category,
    type: 'video',
    src: paths.public.src,
    poster: paths.public.poster,
    originalFilename: basename(source.path),
  }
}

async function readState(path) {
  try {
    const value = JSON.parse(await readFile(path, 'utf8'))
    return value?.version === PIPELINE_VERSION && typeof value.files === 'object'
      ? value.files
      : {}
  } catch {
    return {}
  }
}

async function atomicJsonWrite(path, value) {
  const temporaryPath = temporarySibling(path)
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
    await rename(temporaryPath, path)
  } finally {
    await rm(temporaryPath, { force: true }).catch(() => {})
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  assertSafeRoots(options.input, options.output)

  if (!await exists(options.input)) {
    throw new Error(`Input directory does not exist: ${options.input}`)
  }
  assertSafeRoots(
    await canonicalPath(options.input),
    await canonicalPath(options.output),
  )

  const sources = await discoverSources(options.input)
  const requiredCommands = ['ffmpeg', 'ffprobe', 'cwebp']
  if (sources.some((source) => source.extension === '.heic')) {
    requiredCommands.push('heif-convert')
  }
  const missingCommands = []
  for (const command of requiredCommands) {
    if (!await commandAvailable(command)) missingCommands.push(command)
  }
  if (missingCommands.length > 0) {
    const packages = []
    if (missingCommands.some((command) => command === 'ffmpeg' || command === 'ffprobe')) {
      packages.push('ffmpeg')
    }
    if (missingCommands.includes('cwebp')) packages.push('webp')
    if (missingCommands.includes('heif-convert')) packages.push('libheif-examples')
    throw new Error(
      `Missing required commands: ${missingCommands.join(', ')}. Ubuntu 22.04 packages: ${packages.join(', ')}`,
    )
  }

  await mkdir(options.output, { recursive: true })
  const statePath = join(options.output, '.media-state.json')
  const manifestPath = join(options.output, 'manifest.json')
  const previousState = await readState(statePath)
  const nextState = {}
  const items = []
  const counters = { processed: 0, skipped: 0, errors: 0 }

  for (const source of sources) {
    const key = `${source.category}/${source.relativePath}`
    const paths = outputPaths(source, options.output, options.publicBase)
    try {
      const sourceStat = await stat(source.path)
      const valid = await validateExisting(source, paths, previousState[key], sourceStat)
      if (valid) {
        counters.skipped += 1
        console.log(`[skip] ${key}`)
      } else {
        if (source.type === 'image') {
          await processImage(source, paths)
        } else {
          await processVideo(source, paths)
        }
        counters.processed += 1
        console.log(`[ok] ${key}`)
      }

      nextState[key] = {
        pipelineVersion: PIPELINE_VERSION,
        sourceSize: sourceStat.size,
        sourceMtimeMs: sourceStat.mtimeMs,
      }
      items.push(manifestItem(source, paths))
    } catch (error) {
      counters.errors += 1
      console.error(`[error] ${key}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  await atomicJsonWrite(statePath, { version: PIPELINE_VERSION, files: nextState })
  await atomicJsonWrite(manifestPath, {
    version: PIPELINE_VERSION,
    generatedAt: new Date().toISOString(),
    items,
  })

  console.log('')
  console.log(`processed: ${counters.processed}`)
  console.log(`skipped: ${counters.skipped}`)
  console.log(`errors: ${counters.errors}`)
  console.log(`manifest: ${manifestPath}`)

  if (counters.errors > 0) process.exitCode = 1
}

main().catch((error) => {
  console.error(`[fatal] ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
