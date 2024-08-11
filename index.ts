import fs from 'node:fs';
import { faker } from '@faker-js/faker';
// @ts-ignore
import Hash from 'ipfs-only-hash';

interface Player {
  name: string;
  description: string;
  external_url: string;
  image: `ipfs://${string}`;
  jersey_number: number;
  tier: number;
  overall_rating: number;

  attributes: {
    display_type: string;
    trait_type: string;
    value: number;
  }[];

  skill_multiplier: number;
  skill: {
    speed: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defense: number;
    physical: number;
    goal_tending: number;
  }
}

const PLAYER_COUNT = 1000;
const MEDIAN_OVERALL_RATING = 75;
const STANDARD_DEVIATION = 10;

function normalRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generateOverallRating(stdDev: number, median: number): number {
  let rating = Math.round(normalRandom() * stdDev + median);
  return Math.max(40, Math.min(99, rating));
}

function generateSkillScores(overallRating: number): number[] {
  const baseSkill = Math.max(1, overallRating - 20);
  const skillSpread = Math.floor((overallRating - baseSkill) / 2);

  let skills = Array(7).fill(0).map(() =>
    Math.max(1, Math.min(99, baseSkill + Math.floor(Math.random() * skillSpread * 2)))
  );

  // Ensure at least one skill is close to the overall rating
  const primarySkillIndex = Math.floor(Math.random() * skills.length);
  skills[primarySkillIndex] = overallRating - Math.floor(Math.random() * 5);

  return skills;
}

function calculateTier(overallRating: number): number {
  if (overallRating >= 90) return 0; // Superstar
  if (overallRating >= 80) return 1; // All-Star
  if (overallRating >= 70) return 2; // Starter
  if (overallRating >= 60) return 3; // Rotation
  return 4; // Bench
}

const generatePlayers = async (playerCount: number, stdDev: number, median: number) => {
  for (let i = 0; i < playerCount; i++) {
    const overallRating = generateOverallRating(stdDev, median);
    const skillScores = generateSkillScores(overallRating);
    const name = faker.person.fullName();
    const jersey_number = faker.number.int({ min: 1, max: 99 });
    const playerSvg = fs.readFileSync(`./player_svgs/${i}.svg`, 'utf-8');
    const svgHash = await Hash.of(playerSvg);

    const player: Player = {
      name,
      jersey_number,
      description: `Number ${jersey_number} ${name}. Overall rating of ${overallRating}.`,
      external_url: `https://example.com/player/${i}`,
      image: `ipfs://${svgHash}`,
      tier: calculateTier(overallRating),
      overall_rating: overallRating,

      skill_multiplier: 1,
      skill: {

        speed: skillScores[0],
        shooting: skillScores[1],
        passing: skillScores[2],
        dribbling: skillScores[3],
        defense: skillScores[4],
        physical: skillScores[5],
        goal_tending: skillScores[6],
      },

      attributes: [
        { display_type: 'skill_multiplier', trait_type: 'Skill Multiplier', value: 1 },
        { display_type: 'speed', trait_type: 'Speed', value: skillScores[0] },
        { display_type: 'shooting', trait_type: 'Shooting', value: skillScores[1] },
        { display_type: 'passing', trait_type: 'Passing', value: skillScores[2] },
        { display_type: 'dribbling', trait_type: 'Dribbling', value: skillScores[3] },
        { display_type: 'defense', trait_type: 'Defense', value: skillScores[4] },
        { display_type: 'physical', trait_type: 'Physical Strength', value: skillScores[5] },
        { display_type: 'goal_tending', trait_type: 'Goal Tending', value: skillScores[6] },
      ]
    };

    fs.writeFileSync(`players/${i}.json`, JSON.stringify(player));
  }
}

generatePlayers(PLAYER_COUNT, STANDARD_DEVIATION, MEDIAN_OVERALL_RATING);