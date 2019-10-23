import * as Random from 'expo-random';
// @ts-ignore: no module declaration for sjcl
import * as sjcl from './sjcl-mini';
import { Buffer } from 'buffer';

async function prngAddEntropy(entropyBits = 1024) {
  const bytes = await Random.getRandomBytesAsync(entropyBits / 8);
  const buf = new Uint32Array(new Uint8Array(bytes).buffer);
  sjcl.random.addEntropy(buf as any, entropyBits, 'Random.getRandomBytesAsync');
}
prngAddEntropy();

export function randomBytes(size: number): Buffer {
  const ret = sjcl.random.randomWords(Math.ceil(size / 4));
  // We are always aiming for at least level 9 readiness
  if (sjcl.random.getProgress(9) === 1.0) {
    prngAddEntropy();
  }
  return new Buffer(sjcl.codec.bytes.fromBits(ret));
}
export const rng = randomBytes;
export const pseudoRandomBytes = randomBytes;
export const prng = randomBytes;

interface Hash {
  update(data: Buffer): void;
  digest(): Buffer;
}

class Sha1Hash implements Hash {
  private hash: any;

  constructor() {
    this.hash = new sjcl.hash.sha1();
  }

  public update(data: Buffer) {
    const bytes = new Uint8Array(data);
    this.hash.update(sjcl.codec.bytes.toBits(bytes));
  }

  public digest(): Buffer {
    const ret = this.hash.finalize();
    const bytes = sjcl.codec.bytes.fromBits(ret);

    return new Buffer(bytes);
  }
}

export function createHash(algorithm: string) {
  if (algorithm === 'sha1') {
    return new Sha1Hash();
  }
  throw new Error(`hash algorithm "${algorithm}" is not supported`);
}
