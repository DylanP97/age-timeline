import type { CelebrityResult } from "../types";

/**
 * Local celebrity dataset backing the first version of `searchCelebrity`.
 * Images use Wikimedia Commons thumbnails so the data shape already matches
 * what a Wikipedia/Wikidata-backed provider would return later.
 */
export const CELEBRITY_DB: CelebrityResult[] = [
  {
    name: "Lionel Messi",
    birthYear: 1987,
    blurb: "Footballer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/240px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
  },
  {
    name: "Cristiano Ronaldo",
    birthYear: 1985,
    blurb: "Footballer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/240px-Cristiano_Ronaldo_2018.jpg",
  },
  {
    name: "Taylor Swift",
    birthYear: 1989,
    blurb: "Singer-songwriter",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/240px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png",
  },
  {
    name: "Barack Obama",
    birthYear: 1961,
    blurb: "44th U.S. President",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/240px-President_Barack_Obama.jpg",
  },
  {
    name: "Elon Musk",
    birthYear: 1971,
    blurb: "Entrepreneur",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/240px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
  },
  {
    name: "Albert Einstein",
    birthYear: 1879,
    deathYear: 1955,
    blurb: "Physicist",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/240px-Albert_Einstein_Head.jpg",
  },
  {
    name: "Napoleon Bonaparte",
    birthYear: 1769,
    deathYear: 1821,
    blurb: "Emperor of the French",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/240px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg",
  },
  {
    name: "Marie Curie",
    birthYear: 1867,
    deathYear: 1934,
    blurb: "Physicist & chemist",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c._1920s.jpg/240px-Marie_Curie_c._1920s.jpg",
  },
  {
    name: "Leonardo da Vinci",
    birthYear: 1452,
    deathYear: 1519,
    blurb: "Polymath",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Leonardo_self.jpg/240px-Leonardo_self.jpg",
  },
  {
    name: "Ludwig van Beethoven",
    birthYear: 1770,
    deathYear: 1827,
    blurb: "Composer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/240px-Beethoven.jpg",
  },
  {
    name: "Abraham Lincoln",
    birthYear: 1809,
    deathYear: 1865,
    blurb: "16th U.S. President",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/240px-Abraham_Lincoln_O-77_matte_collodion_print.jpg",
  },
  {
    name: "Charles Darwin",
    birthYear: 1809,
    deathYear: 1882,
    blurb: "Naturalist",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Charles_Darwin_seated_crop.jpg/240px-Charles_Darwin_seated_crop.jpg",
  },
  {
    name: "Queen Elizabeth II",
    birthYear: 1926,
    deathYear: 2022,
    blurb: "Monarch",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Queen_Elizabeth_II_in_March_2015.jpg/240px-Queen_Elizabeth_II_in_March_2015.jpg",
  },
  {
    name: "Steve Jobs",
    birthYear: 1955,
    deathYear: 2011,
    blurb: "Co-founder of Apple",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/240px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg",
  },
  {
    name: "Frida Kahlo",
    birthYear: 1907,
    deathYear: 1954,
    blurb: "Painter",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/240px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
  },
  {
    name: "Nelson Mandela",
    birthYear: 1918,
    deathYear: 2013,
    blurb: "Statesman",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/240px-Nelson_Mandela_1994.jpg",
  },
  {
    name: "Ada Lovelace",
    birthYear: 1815,
    deathYear: 1852,
    blurb: "Mathematician",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/240px-Ada_Lovelace_portrait.jpg",
  },
  {
    name: "Wolfgang Amadeus Mozart",
    birthYear: 1756,
    deathYear: 1791,
    blurb: "Composer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Croce-Mozart-Detail.jpg/240px-Croce-Mozart-Detail.jpg",
  },
  {
    name: "Greta Thunberg",
    birthYear: 2003,
    blurb: "Climate activist",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Greta_Thunberg_01.jpg/240px-Greta_Thunberg_01.jpg",
  },
  {
    name: "Keanu Reeves",
    birthYear: 1964,
    blurb: "Actor",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg/240px-Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg",
  },
  {
    name: "Audrey Hepburn",
    birthYear: 1929,
    deathYear: 1993,
    blurb: "Actress",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/AudreyKHepburn.jpg/240px-AudreyKHepburn.jpg",
  },
  {
    name: "Yuri Gagarin",
    birthYear: 1934,
    deathYear: 1968,
    blurb: "Cosmonaut",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Yuri_Gagarin_with_awards_%28cropped%29_2.jpg/240px-Yuri_Gagarin_with_awards_%28cropped%29_2.jpg",
  },
  {
    name: "Pelé",
    birthYear: 1940,
    deathYear: 2022,
    blurb: "Footballer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Pele_con_brasil_%28cropped%29.jpg/240px-Pele_con_brasil_%28cropped%29.jpg",
  },
  {
    name: "Diana, Princess of Wales",
    birthYear: 1961,
    deathYear: 1997,
    blurb: "Princess of Wales",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/240px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg",
  },
  {
    name: "Michael Jackson",
    birthYear: 1958,
    deathYear: 2009,
    blurb: "Singer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg/240px-Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg",
  },
  {
    name: "Serena Williams",
    birthYear: 1981,
    blurb: "Tennis player",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg/240px-Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg",
  },
];
