import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const output = path.join(root, 'dist')
const source = JSON.parse(await fs.readFile(path.join(root, 'content.json'), 'utf8'))
const css = await fs.readFile(path.join(root, 'style.css'), 'utf8')
const routes = {home:'首页', about:'关于我们', cases:'案例展示', news:'新闻动态'}
const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
  ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[char])
const url = (from, to) => path.posix.relative(path.posix.dirname(from), to) || 'index.html'
const index = key => key === 'home' ? 'index.html' : key + '/index.html'
const used = new Set()

function body(page) {
  // Trusted HTML exported from the owner’s website or CMS.
  return page.html || '<p>原站内容待迁移。</p>'
}

function ticker() {
  const items = (source.ticker ?? ['SPACE IDEA', '点意空间']).map(escape)
  const group = '<div class="ticker-group" aria-hidden="true">' +
    Array.from({length: 4}, () => items.map(item =>
      '<span>'+item+'</span><b>✦</b>').join('')).join('') + '</div>'
  return '<div class="ticker"><div class="ticker-window" aria-hidden="true"><div class="ticker-track">'+
    group+group+'</div></div><button class="ticker-toggle" type="button" hidden>暂停字幕</button></div>'
}

async function write(file, key, page, content) {
  if (used.has(file)) throw new Error('Duplicate route: ' + file)
  used.add(file)
  const nav = Object.entries(routes).map(([route,label]) =>
    '<a href="'+url(file,index(route))+'"'+(key === route ? ' aria-current="true"' : '')+'>'+label+'</a>').join('')
  const title = escape(page.title || routes[key])
  const cover = key === 'home' && source.cover ? '<img src="'+escape(url(file,source.cover))+'" alt="">' : ''
  const hero = key === 'home' ? '<section class="hero">'+cover+'<div class="wrap"><h1>'+title+'</h1></div></section>' :
    '<section class="wrap page-title"><h1>'+title+'</h1>'+(page.date ? '<time>'+escape(page.date)+'</time>' : '')+'</section>'
  const target = path.join(output,file)
  await fs.mkdir(path.dirname(target),{recursive:true})
  await fs.writeFile(target,'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+title+' | 点意空间</title><style>'+css+'</style><script defer src="'+url(file,'assets/motion.js')+'"></script><script defer src="'+url(file,'assets/interactions.js')+'"></script></head><body><a class="skip" href="#main">跳到正文</a><header><div class="wrap nav"><a class="brand" href="'+url(file,index('home'))+'">点意空间</a><nav aria-label="主导航">'+nav+'</nav></div></header><main id="main">'+hero+(key === 'home' ? ticker() : '')+'<div class="wrap reading">'+content+'</div></main><footer><div class="wrap"><a href="'+url(file,index('home'))+'">点意空间</a></div></footer></body></html>')
}

for (const key of Object.keys(routes)) {
  const page = source[key] ?? {}
  const file = index(key)
  const entries = page.items ?? []
  const cards = []
  for (const entry of entries) {
    if (typeof entry.slug !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(entry.slug)) {
      throw new Error('Invalid page slug in ' + key)
    }
    const detail = key + '/' + entry.slug + '/index.html'
    await write(detail,key,entry,body(entry)+'<p><a href="'+url(detail,file)+'">返回'+routes[key]+'</a></p>')
    const thumbnail = entry.thumbnail ? '<img loading="lazy" src="'+escape(url(file,entry.thumbnail))+'" alt="">' : ''
    cards.push('<li><a href="'+url(file,detail)+'">'+thumbnail+'<span>'+escape(entry.title)+'</span></a>'+(entry.date?'<time>'+escape(entry.date)+'</time>':'')+'</li>')
  }
  const listing = cards.length ? '<ul class="entries '+key+'">'+cards.join('')+'</ul>' : ''
  await write(file,key,page,page.html || !listing ? body(page)+listing : listing)
}
const assets = path.join(root,'assets')
if (await fs.stat(assets).then(() => true, error => {
  if (error.code === 'ENOENT') return false
  throw error
})) await fs.cp(assets,path.join(output,'assets'),{recursive:true})
console.log('Generated ' + used.size + ' pages in ' + output)
