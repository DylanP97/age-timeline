import type { CelebrityResult } from "../types";

/**
 * Local celebrity dataset backing the first version of `searchCelebrity`.
 * Images use Wikimedia Commons thumbnails so the data shape already matches
 * what a Wikipedia/Wikidata-backed provider would return later. Birth/death
 * carry full ISO dates (`birthDate`/`deathDate`) so ages are accurate to the
 * day; `birthYear`/`deathYear` remain the canonical fields for positioning.
 */
export const CELEBRITY_DB: CelebrityResult[] = [
  {
    name: "Lionel Messi",
    birthYear: 1987,
    birthDate: "1987-06-24",
    blurb: "Footballer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/240px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
  },
  {
    name: "Cristiano Ronaldo",
    birthYear: 1985,
    birthDate: "1985-02-05",
    blurb: "Footballer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/240px-Cristiano_Ronaldo_2018.jpg",
  },
  {
    name: "Taylor Swift",
    birthYear: 1989,
    birthDate: "1989-12-13",
    blurb: "Singer-songwriter",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/240px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png",
  },
  {
    name: "Barack Obama",
    birthYear: 1961,
    birthDate: "1961-08-04",
    blurb: "44th U.S. President",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/240px-President_Barack_Obama.jpg",
  },
  {
    name: "Elon Musk",
    birthYear: 1971,
    birthDate: "1971-06-28",
    blurb: "Entrepreneur",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/240px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
  },
  {
    name: "Albert Einstein",
    birthYear: 1879,
    birthDate: "1879-03-14",
    deathYear: 1955,
    deathDate: "1955-04-18",
    blurb: "Physicist",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/240px-Albert_Einstein_Head.jpg",
  },
  {
    name: "Napoleon Bonaparte",
    birthYear: 1769,
    birthDate: "1769-08-15",
    deathYear: 1821,
    deathDate: "1821-05-05",
    blurb: "Emperor of the French",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/240px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg",
  },
  {
    name: "Marie Curie",
    birthYear: 1867,
    birthDate: "1867-11-07",
    deathYear: 1934,
    deathDate: "1934-07-04",
    blurb: "Physicist & chemist",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c._1920s.jpg/240px-Marie_Curie_c._1920s.jpg",
  },
  {
    name: "Leonardo da Vinci",
    birthYear: 1452,
    birthDate: "1452-04-15",
    deathYear: 1519,
    deathDate: "1519-05-02",
    blurb: "Polymath",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Leonardo_self.jpg/240px-Leonardo_self.jpg",
  },
  {
    name: "Ludwig van Beethoven",
    birthYear: 1770,
    birthDate: "1770-12-16",
    deathYear: 1827,
    deathDate: "1827-03-26",
    blurb: "Composer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/240px-Beethoven.jpg",
  },
  {
    name: "Abraham Lincoln",
    birthYear: 1809,
    birthDate: "1809-02-12",
    deathYear: 1865,
    deathDate: "1865-04-15",
    blurb: "16th U.S. President",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/240px-Abraham_Lincoln_O-77_matte_collodion_print.jpg",
  },
  {
    name: "Charles Darwin",
    birthYear: 1809,
    birthDate: "1809-02-12",
    deathYear: 1882,
    deathDate: "1882-04-19",
    blurb: "Naturalist",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Charles_Darwin_seated_crop.jpg/240px-Charles_Darwin_seated_crop.jpg",
  },
  {
    name: "Queen Elizabeth II",
    birthYear: 1926,
    birthDate: "1926-04-21",
    deathYear: 2022,
    deathDate: "2022-09-08",
    blurb: "Monarch",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Queen_Elizabeth_II_in_March_2015.jpg/240px-Queen_Elizabeth_II_in_March_2015.jpg",
  },
  {
    name: "Steve Jobs",
    birthYear: 1955,
    birthDate: "1955-02-24",
    deathYear: 2011,
    deathDate: "2011-10-05",
    blurb: "Co-founder of Apple",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/240px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg",
  },
  {
    name: "Frida Kahlo",
    birthYear: 1907,
    birthDate: "1907-07-06",
    deathYear: 1954,
    deathDate: "1954-07-13",
    blurb: "Painter",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/240px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
  },
  {
    name: "Nelson Mandela",
    birthYear: 1918,
    birthDate: "1918-07-18",
    deathYear: 2013,
    deathDate: "2013-12-05",
    blurb: "Statesman",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/240px-Nelson_Mandela_1994.jpg",
  },
  {
    name: "Ada Lovelace",
    birthYear: 1815,
    birthDate: "1815-12-10",
    deathYear: 1852,
    deathDate: "1852-11-27",
    blurb: "Mathematician",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/240px-Ada_Lovelace_portrait.jpg",
  },
  {
    name: "Wolfgang Amadeus Mozart",
    birthYear: 1756,
    birthDate: "1756-01-27",
    deathYear: 1791,
    deathDate: "1791-12-05",
    blurb: "Composer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Croce-Mozart-Detail.jpg/240px-Croce-Mozart-Detail.jpg",
  },
  {
    name: "Greta Thunberg",
    birthYear: 2003,
    birthDate: "2003-01-03",
    blurb: "Climate activist",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Greta_Thunberg_01.jpg/240px-Greta_Thunberg_01.jpg",
  },
  {
    name: "Keanu Reeves",
    birthYear: 1964,
    birthDate: "1964-09-02",
    blurb: "Actor",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg/240px-Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg",
  },
  {
    name: "Audrey Hepburn",
    birthYear: 1929,
    birthDate: "1929-05-04",
    deathYear: 1993,
    deathDate: "1993-01-20",
    blurb: "Actress",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/AudreyKHepburn.jpg/240px-AudreyKHepburn.jpg",
  },
  {
    name: "Yuri Gagarin",
    birthYear: 1934,
    birthDate: "1934-03-09",
    deathYear: 1968,
    deathDate: "1968-03-27",
    blurb: "Cosmonaut",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Yuri_Gagarin_with_awards_%28cropped%29_2.jpg/240px-Yuri_Gagarin_with_awards_%28cropped%29_2.jpg",
  },
  {
    name: "Pelé",
    birthYear: 1940,
    birthDate: "1940-10-23",
    deathYear: 2022,
    deathDate: "2022-12-29",
    blurb: "Footballer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Pele_con_brasil_%28cropped%29.jpg/240px-Pele_con_brasil_%28cropped%29.jpg",
  },
  {
    name: "Diana, Princess of Wales",
    birthYear: 1961,
    birthDate: "1961-07-01",
    deathYear: 1997,
    deathDate: "1997-08-31",
    blurb: "Princess of Wales",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/240px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg",
  },
  {
    name: "Michael Jackson",
    birthYear: 1958,
    birthDate: "1958-08-29",
    deathYear: 2009,
    deathDate: "2009-06-25",
    blurb: "Singer",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg/240px-Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg",
  },
  {
    name: "Serena Williams",
    birthYear: 1981,
    birthDate: "1981-09-26",
    blurb: "Tennis player",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg/240px-Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg",
  },
  // —— 18th century (born 1700s). Portraits resolve from the live provider in
  //    search and are fetched on first seed, so no thumbnails hardcoded here.
  {
    name: "Benjamin Franklin",
    birthYear: 1706,
    birthDate: "1706-01-17",
    deathYear: 1790,
    deathDate: "1790-04-17",
    blurb: "Polymath & statesman",
  },
  {
    name: "George Washington",
    birthYear: 1732,
    birthDate: "1732-02-22",
    deathYear: 1799,
    deathDate: "1799-12-14",
    blurb: "1st U.S. President",
  },
  {
    name: "Thomas Jefferson",
    birthYear: 1743,
    birthDate: "1743-04-13",
    deathYear: 1826,
    deathDate: "1826-07-04",
    blurb: "3rd U.S. President",
  },
  {
    name: "Johann Wolfgang von Goethe",
    birthYear: 1749,
    birthDate: "1749-08-28",
    deathYear: 1832,
    deathDate: "1832-03-22",
    blurb: "Writer",
  },
  {
    name: "Marie Antoinette",
    birthYear: 1755,
    birthDate: "1755-11-02",
    deathYear: 1793,
    deathDate: "1793-10-16",
    blurb: "Queen of France",
  },
  {
    name: "Jane Austen",
    birthYear: 1775,
    birthDate: "1775-12-16",
    deathYear: 1817,
    deathDate: "1817-07-18",
    blurb: "Novelist",
  },
  // —— 19th century (born 1800s).
  {
    name: "Frédéric Chopin",
    birthYear: 1810,
    birthDate: "1810-03-01",
    deathYear: 1849,
    deathDate: "1849-10-17",
    blurb: "Composer",
  },
  {
    name: "Charles Dickens",
    birthYear: 1812,
    birthDate: "1812-02-07",
    deathYear: 1870,
    deathDate: "1870-06-09",
    blurb: "Novelist",
  },
  {
    name: "Karl Marx",
    birthYear: 1818,
    birthDate: "1818-05-05",
    deathYear: 1883,
    deathDate: "1883-03-14",
    blurb: "Philosopher",
  },
  {
    name: "Queen Victoria",
    birthYear: 1819,
    birthDate: "1819-05-24",
    deathYear: 1901,
    deathDate: "1901-01-22",
    blurb: "Monarch",
  },
  {
    name: "Leo Tolstoy",
    birthYear: 1828,
    birthDate: "1828-09-09",
    deathYear: 1910,
    deathDate: "1910-11-20",
    blurb: "Novelist",
  },
  {
    name: "Mark Twain",
    birthYear: 1835,
    birthDate: "1835-11-30",
    deathYear: 1910,
    deathDate: "1910-04-21",
    blurb: "Writer",
  },
  {
    name: "Thomas Edison",
    birthYear: 1847,
    birthDate: "1847-02-11",
    deathYear: 1931,
    deathDate: "1931-10-18",
    blurb: "Inventor",
  },
  {
    name: "Vincent van Gogh",
    birthYear: 1853,
    birthDate: "1853-03-30",
    deathYear: 1890,
    deathDate: "1890-07-29",
    blurb: "Painter",
  },
  {
    name: "Nikola Tesla",
    birthYear: 1856,
    birthDate: "1856-07-10",
    deathYear: 1943,
    deathDate: "1943-01-07",
    blurb: "Inventor",
  },
  {
    name: "Mahatma Gandhi",
    birthYear: 1869,
    birthDate: "1869-10-02",
    deathYear: 1948,
    deathDate: "1948-01-30",
    blurb: "Independence leader",
  },
  {
    name: "Winston Churchill",
    birthYear: 1874,
    birthDate: "1874-11-30",
    deathYear: 1965,
    deathDate: "1965-01-24",
    blurb: "Prime Minister",
  },
  {
    name: "Pablo Picasso",
    birthYear: 1881,
    birthDate: "1881-10-25",
    deathYear: 1973,
    deathDate: "1973-04-08",
    blurb: "Painter",
  },
  // —— Living figures, recent era. Portraits are fetched from the web on first
  //    seed (and via the live provider in search), so no thumbnails hardcoded.
  {
    name: "Oprah Winfrey",
    birthYear: 1954,
    birthDate: "1954-01-29",
    blurb: "Media executive & host",
  },
  {
    name: "Leonardo DiCaprio",
    birthYear: 1974,
    birthDate: "1974-11-11",
    blurb: "Actor",
  },
  {
    name: "Beyoncé",
    birthYear: 1981,
    birthDate: "1981-09-04",
    blurb: "Singer",
  },
  {
    name: "LeBron James",
    birthYear: 1984,
    birthDate: "1984-12-30",
    blurb: "Basketball player",
  },
  {
    name: "Zendaya",
    birthYear: 1996,
    birthDate: "1996-09-01",
    blurb: "Actress",
  },
  {
    name: "Billie Eilish",
    birthYear: 2001,
    birthDate: "2001-12-18",
    blurb: "Singer-songwriter",
  },
];
