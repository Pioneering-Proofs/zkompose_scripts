import fs from 'fs';
import * as crypto from 'crypto';

class PixelatedCharacterGenerator {
  private readonly size = 24;
  private readonly colors = {
    skin: ['#8D5524', '#C68642', '#E0AC69', '#F1C27D', '#FFDBAC'],
    hair: ['#1C1C1C', '#4E3835', '#8E5B3F', '#D4B37F', '#E8D0B3'],
    eyes: ['#1C1C1C', '#4E3835', '#634e34', '#2c536f', '#25e1e1'],
    lips: ['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#ef233c'],
  };

  generateCharacter(seed?: string): string {
    const rng = this.createRNG(seed);
    const skinColor = this.getRandomColor(this.colors.skin, rng);
    const hairColor = this.getRandomColor(this.colors.hair, rng);
    const eyeColor = this.getRandomColor(this.colors.eyes, rng);
    const lipColor = this.getRandomColor(this.colors.lips, rng);

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.size} ${this.size}">`;

    // Generate face
    svgContent += this.generateFace(skinColor, rng);

    // Generate hair/headgear
    svgContent += this.generateHair(hairColor, rng);

    // Generate eyes
    svgContent += this.generateEyes(eyeColor, rng);

    // Generate nose
    svgContent += this.generateNose(skinColor, rng);

    // Generate lips
    svgContent += this.generateLips(lipColor, rng);

    svgContent += '</svg>';
    return svgContent;
  }

  private createRNG(seed?: string): () => number {
    const hash = crypto.createHash('sha256');
    hash.update(seed || Math.random().toString());
    const seedBuffer = hash.digest();
    let index = 0;

    return () => {
      if (index >= seedBuffer.length) index = 0;
      const value = seedBuffer.readUInt8(index) / 255;
      index++;
      return value;
    };
  }

  private getRandomColor(colors: string[], rng: () => number): string {
    return colors[Math.floor(rng() * colors.length)];
  }

  private generatePixel(x: number, y: number, color: string): string {
    return `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`;
  }

  private generateFace(skinColor: string, rng: () => number): string {
    let face = '';
    const xDisplacement = Math.floor(rng() * 4) + 4;
    const borderRadius = Math.floor(rng() * 4) + 4;

    for (let y = 4; y < this.size - 4; y++) {
      for (let x = xDisplacement; x < this.size - xDisplacement; x++) {
        face += this.generatePixel(x, y, skinColor);
      }
    }
    return face;
  }

  private generateHair(hairColor: string, rng: () => number): string {
    let hair = '';
    const hairStyle = Math.floor(rng() * 3);

    switch (hairStyle) {
      case 0: // Short hair
        for (let y = 2; y < 6; y++) {
          for (let x = 2; x < this.size - 2; x++) {
            if (rng() > 0.3) {
              hair += this.generatePixel(x, y, hairColor);
            }
          }
        }
        break;
      case 1: // Long hair
        for (let y = 2; y < 6; y++) {
          for (let x = 2; x < this.size - 2; x++) {
            if (rng() > 0.05) {
              hair += this.generatePixel(x, y, hairColor);
            }
          }
        }
        for (let y = 2; y < this.size - 2; y++) {
          for (let x = 2; x < this.size - 2; x++) {
            if ((x < 4 || x > this.size - 5) && rng() > 0.3) {
              hair += this.generatePixel(x, y, hairColor);
            }
          }
        }
        break;
      case 2: // Hat
        for (let y = 2; y < 6; y++) {
          for (let x = 2; x < this.size - 2; x++) {
            if (rng() > 0.05) {
              hair += this.generatePixel(x, y, hairColor);
            }
          }
        }
        break;
    }

    return hair;
  }

  private generateEyes(eyeColor: string, rng: () => number): string {
    const eyeStyle = Math.floor(rng() * 3);
    const leftEyeX = 8;
    const rightEyeX = 15;
    const eyeY = 10;

    let eyes = '';

    switch (eyeStyle) {
      case 0: // Dots
        eyes += this.generatePixel(leftEyeX, eyeY, eyeColor);
        eyes += this.generatePixel(rightEyeX, eyeY, eyeColor);
        break;
      case 1: // Small rectangles
        eyes += this.generatePixel(leftEyeX, eyeY, eyeColor);
        eyes += this.generatePixel(leftEyeX + 1, eyeY, eyeColor);
        eyes += this.generatePixel(rightEyeX, eyeY, eyeColor);
        eyes += this.generatePixel(rightEyeX + 1, eyeY, eyeColor);
        break;
      case 2: // Large rectangles
        eyes += this.generatePixel(leftEyeX, eyeY, eyeColor);
        eyes += this.generatePixel(leftEyeX + 1, eyeY, eyeColor);
        eyes += this.generatePixel(leftEyeX, eyeY + 1, eyeColor);
        eyes += this.generatePixel(leftEyeX + 1, eyeY + 1, eyeColor);
        eyes += this.generatePixel(rightEyeX, eyeY, eyeColor);
        eyes += this.generatePixel(rightEyeX + 1, eyeY, eyeColor);
        eyes += this.generatePixel(rightEyeX, eyeY + 1, eyeColor);
        eyes += this.generatePixel(rightEyeX + 1, eyeY + 1, eyeColor);
        break;
    }

    return eyes;
  }

  private generateNose(skinColor: string, rng: () => number): string {
    const noseStyle = Math.floor(rng() * 3);
    const noseX = 11;
    const noseY = 13;

    let nose = '';

    switch (noseStyle) {
      case 0: // Dot
        nose += this.generatePixel(noseX, noseY, skinColor);
        break;
      case 1: // Small vertical line
        nose += this.generatePixel(noseX, noseY, skinColor);
        nose += this.generatePixel(noseX, noseY + 1, skinColor);
        break;
      case 2: // Small horizontal line
        nose += this.generatePixel(noseX, noseY, skinColor);
        nose += this.generatePixel(noseX + 1, noseY, skinColor);
        break;
    }

    return nose;
  }

  private generateLips(lipColor: string, rng: () => number): string {
    const lipStyle = Math.floor(rng() * 3);
    const lipY = 17;

    let lips = '';

    switch (lipStyle) {
      case 0: // Small line
        for (let x = 9; x < 15; x++) {
          lips += this.generatePixel(x, lipY, lipColor);
        }
        break;
      case 1: // Smile
        // lips += this.generatePixel(9, lipY + 1, lipColor);
        lips += this.generatePixel(10, lipY, lipColor);
        lips += this.generatePixel(11, lipY + 1, lipColor);
        lips += this.generatePixel(12, lipY + 1, lipColor);
        lips += this.generatePixel(13, lipY, lipColor);
        // lips += this.generatePixel(14, lipY + 1, lipColor);
        break;
      case 2: // Frown
        // lips += this.generatePixel(9, lipY - 1, lipColor);
        lips += this.generatePixel(10, lipY + 1, lipColor);
        lips += this.generatePixel(11, lipY, lipColor);
        lips += this.generatePixel(12, lipY, lipColor);
        lips += this.generatePixel(13, lipY + 1, lipColor);
        // lips += this.generatePixel(14, lipY - 1, lipColor);
        break;
    }

    return lips;
  }
}

// Usage example
const generateCharacter = (count: number) => {
  const generator = new PixelatedCharacterGenerator();
  for (let i = 0; i < count; i++) {
    const svg = generator.generateCharacter(i.toString());
    // save svg to file or do something else with it
    fs.writeFileSync(`player_svgs/${i}.svg`, svg);
  }
}

generateCharacter(1000);