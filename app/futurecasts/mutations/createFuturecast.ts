import { resolver } from "blitz"
import db from "db"

const defaultFortuneMainText = "The future is not yet clear..."

const whens = ["soon", "never", "it already happen that"]
const whenModifers = ["will", `won't`]
const subjects = ["you", "a cat somewhere", "all of the people", "fred"]
const verbs = ["eat", "outrace", "jump up and down with"]
const nouns = [
  "a hippo",
  "a cat",
  "a dog",
  "sodas",
  "bagels",
  "a single drop of coffee",
  "a potion",
  "a nifty hat",
  "joy",
  "nirvana",
  "that laffy taffy",
  "actual depression",
  "🔥",
  "📙",
  "😎",
  "🧛",
]
const adjectives = ["friendly", "ugly", "stinky", "totes neato", "chubby", "short", "fuerte"]
const conjunctions = ["and", "but", "therefore"]
const quips = [`just don't`, `bruh`, `ye shall, my dawg`, `yeet`, `Ayyyy!`]

// TODO: move to seeders
const FORTUNE_TEMPLATES = [
  [whens, subjects, whenModifers, verbs, nouns],
  [verbs, nouns, quips],
  [quips],
]

const getFuturecastByCastToken = (uuid: string): string => {
  const currFortuneTemplateIndex = uuid.charCodeAt(0) % FORTUNE_TEMPLATES.length
  const currFortuneTemplate = FORTUNE_TEMPLATES[currFortuneTemplateIndex] as string[][]
  const defaultPieceText = "idk"
  let fortuneText = ""

  for (let i = 0; i < currFortuneTemplate.length; i++) {
    const currTemplatePiece = currFortuneTemplate[i] as string[]
    const uuidSeed = uuid.length % currTemplatePiece.length
    const selectedPiece = currTemplatePiece[uuidSeed] || defaultPieceText
    fortuneText = `${fortuneText} ${selectedPiece}`
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
