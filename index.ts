import * as Random from 'expo-random';
import { Buffer } from 'buffer';
import * as Rusha from 'rusha';

(async () => {
  const entropyBits = 1024;
  const bytes = await Random.getRandomBytesAsync(entropyBits / 8);
  const buf = new Uint32Array(new Uint8Array(bytes).buffer);
})();

export function randomBytes(size: number): Buffer {
  return new Buffer(new Array(size).map(() => 0));
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
    this.hash = new Rusha.createHash;
  }

  public update(data: Buffer) {
    this.hash.update(data);
  }

  public digest(): Buffer {
    return new Buffer(this.hash.digest());
  }
}

export function createHash(algorithm: string) {
  if (algorithm === 'sha1') {
    return new Sha1Hash();
  }
  throw new Error(`hash algorithm "${algorithm}" is not supported`);
}
