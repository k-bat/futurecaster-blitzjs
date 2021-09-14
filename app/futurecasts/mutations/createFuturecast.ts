import { resolver } from "blitz"
import db from "db"

const defaultFortuneMainText = "The future is not yet clear..."

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const timesToBeUpon = [
  "a time",
  `a midsummer's eve`,
  "...um...like earlier today...",
  "a fortine",
  ["the ides of ", months],
]
const subjectModifiers = ["will", `won't`]

// normalNouns plural form works like a {normalNoun} and many {normalNoun}s
const normalNouns = [
  "face",
  "hippo",
  "cat",
  "dog",
  "bagel",
  "latte",
  "potion",
  "hat",
  "pet",
  "joy",
  "genie",
  "pickle",
  "hole",
  "ogre",
  "banana",
  "vegetable",
  "bro",
  "dude",
  "zombie",
  "vampire",
]
const emojis = [
  "🔥",
  "📙",
  "😎",
  "🧛",
  "❤️",
  "💩",
  "🌈",
  "☕",
  "🙌",
  "😂",
  "😭",
  "👏",
  "👌",
  "🔮",
  "🧙",
  "⭐",
  "🌟",
  "🌞",
  "🌙",
  "🌕",
  "🌚",
  "😝",
  "😜",
]
const specialNouns = [
  "angelology",
  "demonology",
  "Etemenanki, the Tower of Babel",
  "elves",
  "some peeps from a legit bougie foreign country",
  "the science",
  "dirty Texan Republicans",
  "gun control advocates",
  "the liberal agenda",
  "fae",
  "you",
  "nirvana",
  "daddy",
  "mommy",
  "literally everyone",
  "two dudes (gender neutral dudes, could be ladies) from that one party",
  "that laffy taffy",
  "actual depression",
  "can of soda",
  "ur mom lol",
  "sarah",
  "john",
  "urself",
  "celebrity",
  "some rando",
  `the most cursed of all social media platforms, whose name shall not be spoken,`,
  "TikTok",
  emojis,
]
const nouns = [normalNouns, specialNouns]

const verbs = [
  "eat",
  "run",
  "do the secret handshake",
  "jump up and down",
  "dance",
  "karate chop",
  "tickle",
  "tell a joke",
  "play ball",
  "score the points",
  "swim",
  "get swole",
  "learn the things",
  "become litty",
  "find meaning",
  ["find", specialNouns],
]

const introductions = [
  "wise man say",
  ["wise", normalNouns, "say"],
  "according to science,",
  "i tell u wat, ",
  ["once upon", timesToBeUpon],
]

const times = [
  "almost",
  "sometimes",
  "always",
  "soon",
  "never",
  ", as previously noted,",
  "often",
  "from here on out",
  ["until the", normalNouns, verbs],
  "now",
]
const adjectives = [
  "black",
  "bottomless",
  "curvy",
  "sensual",
  "nasty tasting",
  "cage-free",
  "open source",
  "cool sounding",
  "dumb smelling",
  "dumb looking",
  "super technologically advanced",
  "12th century",
  "magic-y",
  "friendly",
  "ugly",
  "stinky",
  "totes neato",
  "chubby",
  "short",
  "fuerte",
  "noice",
  "GigaChad",
  "nifty",
  "a single drop of",
]
const conjunctions = ["and", "but", "therefore"]
const endings = [
  `just don't`,
  `bless your heart`,
  `yasssss queen!`,
  `mk girlfriend?`,
  `this could be us but u playin`,
  `bruh`,
  `ye shall, my dawg`,
  "turn up!",
  "just let the energy vibe ur waves, bro",
  `yeet`,
  `Ayyyy!`,
  `ISN'T THAT SUPER AWESOME?`,
]
const hashtags = ["#bet", "#bigfacts", "#idc", "#iykyk", "#allthattea", "#sayless"]

// TODO: move to seeders
const FORTUNE_TEMPLATES = [
  [introductions, nouns, subjectModifiers, verbs, nouns],
  [introductions, nouns, subjectModifiers, verbs, nouns, conjunctions, verbs, nouns],
  [nouns, subjectModifiers, times, verbs, nouns],
  [nouns, subjectModifiers, times, verbs, conjunctions, nouns, subjectModifiers, verbs],
  [nouns, subjectModifiers, times, verbs, conjunctions, nouns, subjectModifiers, verbs, nouns],
  [`aint no`, nouns, `like a`, nouns],
  [verbs, nouns, endings],
  [endings],
  [adjectives, adjectives, nouns, subjectModifiers, verbs, hashtags, hashtags],
  [nouns, subjectModifiers, verbs, endings],
  [endings, hashtags],
  [emojis, hashtags],
  [emojis, emojis, emojis],
  [hashtags],
]

const defaultPieceText = "idk"
type TemplatePiece = string | string[] | TemplatePiece[] | undefined

const getFuturecastSegment = (tp: TemplatePiece, uuidSeed: number): string => {
  if (!tp) {
    return defaultPieceText
  } else if (typeof tp === "string") {
    return `${tp} `
  }

  const nextTp = tp[uuidSeed % tp.length]
  return getFuturecastSegment(nextTp, uuidSeed)
}

const getFuturecastByCastToken = (uuid: string): string => {
  const currFortuneTemplateIndex = uuid.charCodeAt(0) % FORTUNE_TEMPLATES.length
  const currFortuneTemplate = FORTUNE_TEMPLATES[currFortuneTemplateIndex] || []
  let fortuneText = ""

  for (let i = 0; i < currFortuneTemplate.length; i++) {
    const uuidSeedIndex = i % uuid.length
    const uuidSeed = uuid.charCodeAt(uuidSeedIndex)
    const currTemplatePiece: TemplatePiece = currFortuneTemplate[i]
    fortuneText += getFuturecastSegment(currTemplatePiece, uuidSeed)
  }

  return fortuneText.trim()
}

export default resolver.pipe(resolver.authorize(), async () => {
  const futurecast = await db.futurecast.create({ data: { mainText: defaultFortuneMainText } })
  const { castToken } = futurecast

  const updatedFuturecast = await db.futurecast.update({
    where: { id: futurecast.id },
    data: { mainText: getFuturecastByCastToken(castToken) },
  })

  return updatedFuturecast
})
