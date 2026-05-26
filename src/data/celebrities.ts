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
    name: "Martin Luther King Jr.",
    birthYear: 1929,
    deathYear: 1968,
    blurb: "Civil rights leader",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Martin_Luther_King%2C_Jr._and_Lyndon_Johnson_%28cropped%29.jpg/240px-Martin_Luther_King%2C_Jr._and_Lyndon_Johnson_%28cropped%29.jpg",
  },
  {
    name: "Stephen Hawking",
    birthYear: 1942,
    deathYear: 2018,
    blurb: "Theoretical physicist",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg",
  },
  {
    name: "Freddie Mercury",
    birthYear: 1946,
    deathYear: 1991,
    blurb: "Singer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg/240px-Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg",
  },
  {
    name: "Michael Jordan",
    birthYear: 1963,
    blurb: "Basketball player",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/240px-Michael_Jordan_in_2014.jpg",
  },
  {
    name: "Serena Williams",
    birthYear: 1981,
    blurb: "Tennis player",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg/240px-Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg",
  },
];
