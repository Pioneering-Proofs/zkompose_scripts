-- interface Player {
--   name: string;
--   description: string;
--   external_url: string;
--   image: `ipfs://${string}`;
--   jerseyNumber: number;
--   tier: number;
--   overallRating: number;

--   attributes: {
--     display_type: string;
--     trait_type: string;
--     value: number;
--   }[];

--   skill: {
--     multiplier: number;

--     speed: number;
--     shooting: number;
--     passing: number;
--     dribbling: number;
--     defense: number;
--     physical: number;
--     goalTending: number;
--   }
-- }

create table players (
  id serial primary key,

  -- wallet_address should be nullable
  wallet_address varchar(255),
  
  token_id integer unique not null,
  name varchar(255) not null,
  
  description varchar(255) not null,
  external_url varchar(255) not null,
  image varchar(255) not null,

  jersey_number integer not null,
  tier integer not null,
  overall_rating integer not null,

  skill_multiplier integer not null,

  speed integer not null,
  shooting integer not null,
  passing integer not null,
  dribbling integer not null,
  defense integer not null,
  physical integer not null,
  goal_tending integer not null,

  minted boolean not null default false
);