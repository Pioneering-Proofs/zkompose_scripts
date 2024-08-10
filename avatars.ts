import fs from 'node:fs';
import crypto from 'node:crypto';

interface Player {
  name: string;
  jerseyNumber: number;
  tier: number;
  overallRating: number;
  skill: {
    multiplier: number;
    speed: number;
    shooting: number;
    passing: number;
    dribble: number;
    defense: number;
    physical: number;
    goalTending: number;
  }
}

const GRID_SIZE = 8;
const PIXEL_SIZE = 24;

function generateColor(seed: string): string {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return `#${hash.substr(0, 6)}`;
}

function generatePixelatedSVG(player: Player): string {
  const svgWidth = GRID_SIZE * PIXEL_SIZE;
  const svgHeight = GRID_SIZE * PIXEL_SIZE;

  let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

  // Generate unique colors based on player attributes
  const bodyColor = generateColor(player.name);
  const hairColor = generateColor(player.name + player.jerseyNumber.toString());
  const jerseyColor = generateColor(player.overallRating.toString());

  // Create pixelated body
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const seed = `${player.name}${x}${y}`;
      const hash = crypto.createHash('md5').update(seed).digest('hex');
      const shouldFill = parseInt(hash.substr(0, 8), 16) % 2 === 0;

      if (shouldFill) {
        let fillColor;
        if (y < 2) {
          fillColor = hairColor; // Hair
        } else if (y < 3) {
          fillColor = bodyColor; // Face
        } else {
          fillColor = jerseyColor; // Jersey
        }

        svgContent += `<rect x="${x * PIXEL_SIZE}" y="${y * PIXEL_SIZE}" width="${PIXEL_SIZE}" height="${PIXEL_SIZE}" fill="${fillColor}" />`;
      }
    }
  }

  // Add jersey number
  svgContent += `<text x="${svgWidth / 2}" y="${svgHeight - 5}" font-family="Arial" font-size="12" fill="white" text-anchor="middle">${player.jerseyNumber}</text>`;

  svgContent += '</svg>';
  return svgContent;
}

function generatePlayerSVGs() {
  const playerFiles = fs.readdirSync('players');

  playerFiles.forEach(file => {
    const playerData = JSON.parse(fs.readFileSync(`players/${file}`, 'utf-8'));
    const svgContent = generatePixelatedSVG(playerData);
    fs.writeFileSync(`player_svgs/${file.replace('.json', '.svg')}`, svgContent);
  });
}

generatePlayerSVGs();