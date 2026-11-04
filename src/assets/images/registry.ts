import avatar from './avatar.png'
import heroS1 from './hero-s1.jpg'
import referenceDog from './reference-dog.jpg'
import sampleCar from './sample-car.jpg'
import sampleDog from './sample-dog.jpg'

/** Images extracted from the mockup (+ generated mock variants in ./variants). Data refers to these by key. */
const named: Record<string, string> = {
  avatar,
  'hero-s1': heroS1,
  'reference-dog': referenceDog,
  'sample-car': sampleCar,
  'sample-dog': sampleDog,
}

export function imageSrc(key: string): string {
  const hit = named[key]
  if (hit) return hit
  // Vite statically analyses this pattern and emits every file in ./variants.
  return new URL(`./variants/${key}.jpg`, import.meta.url).href
}
