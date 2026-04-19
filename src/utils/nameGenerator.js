const adjectives = [
  'Ancient', 'Anonymous', 'Bold', 'Brave', 'Cheerful', 'Clever', 'Cosmic',
  'Curious', 'Daring', 'Dazzling', 'Eager', 'Fancy', 'Feisty', 'Fierce',
  'Fluffy', 'Fuzzy', 'Gentle', 'Giant', 'Glorious', 'Graceful', 'Grumpy',
  'Happy', 'Humble', 'Icy', 'Jolly', 'Joyful', 'Kind', 'Lazy', 'Lively',
  'Majestic', 'Mellow', 'Mighty', 'Mysterious', 'Noble', 'Odd', 'Peppy',
  'Plucky', 'Quiet', 'Radiant', 'Reckless', 'Serene', 'Silly', 'Sleepy',
  'Sneaky', 'Spooky', 'Swift', 'Timid', 'Tiny', 'Unique', 'Vibrant',
  'Whimsical', 'Witty', 'Zany',
]

const animals = [
  'Aardvark', 'Alpaca', 'Armadillo', 'Axolotl', 'Aye-aye', 'Bilby',
  'Binturong', 'Blobfish', 'Capybara', 'Caracal', 'Cassowary', 'Dhole',
  'Dugong', 'Fennec', 'Fossa', 'Gerenuk', 'Hippo', 'Kakapo', 'Kinkajou',
  'Kiwi', 'Manatee', 'Mandrill', 'Narwhal', 'Numbat', 'Okapi', 'Pangolin',
  'Platypus', 'Potoo', 'Proboscis', 'Quokka', 'Quoll', 'Saiga', 'Serval',
  'Shoebill', 'Takin', 'Tapir', 'Tardigrade', 'Wombat',
]

export function generateName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  return `${adj} ${animal}`
}
