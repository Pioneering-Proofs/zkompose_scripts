
import fs from 'fs';
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config';

const supabaseUrl = 'https://glvukwcpxsuunhmxymkp.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// create table players(
//   id serial primary key,
//   token_id integer unique not null,
//   name varchar(255) not null,

//   description varchar(255) not null,
//   external_url varchar(255) not null,
//   image varchar(255) not null,

//   jerseyNumber integer not null,
//   tier integer not null,
//   overall_rating integer not null,

//   skill_multiplier integer not null,

//   speed integer not null,
//   shooting integer not null,
//   passing integer not null,
//   dribbling integer not null,
//   defense integer not null,
//   physical integer not null,
//   goal_tending integer not null
// );

interface Player {
  name: string;
  token_id: number;
  description: string;
  external_url: string;
  image: string;
  jersey_number: number;
  tier: number;
  overall_rating: number;

  skill_multiplier: number;

  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
  goal_tending: number;

  minted: boolean;
}

const insertPlayers = async (players: Player[]) => {
  const { data, error } = await supabase
    .from('players')
    .insert(players)
    .select()

  if (error) {
    console.log('error :>> ', error);
    return;
  }
  console.log("Yaay! Players inserted successfully");
}

const main = async () => {
  // read json files from ./players
  // insert players into db
  const playerFiles = fs.readdirSync('./players');
  const players: Player[] = [];
  playerFiles.forEach((file) => {
    const player = JSON.parse(fs.readFileSync(`./players/${file}`, 'utf-8'));
    const tokenId = parseInt(file.split('.')[0]);
    const image = player.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
    const formattedPlayer: Player = {
      name: player.name,
      token_id: tokenId,
      description: player.description,
      external_url: player.external_url,
      image,
      jersey_number: player.jersey_number,
      tier: player.tier,
      overall_rating: player.overall_rating,
      skill_multiplier: player.skill_multiplier,

      speed: player.skill.speed,
      shooting: player.skill.shooting,
      passing: player.skill.passing,
      dribbling: player.skill.dribbling,
      defense: player.skill.defense,
      physical: player.skill.physical,
      goal_tending: player.skill.goal_tending,

      minted: false
    }

    players.push(formattedPlayer);
  });

  await insertPlayers(players);
}

main();