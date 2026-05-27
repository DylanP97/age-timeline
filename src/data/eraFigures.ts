import type { CelebrityResult } from "../types";

/**
 * Decade-fill dataset behind the "Born in the …s" prompt. When someone taps an
 * empty stretch of the trace we want an instant, generous list of figures from
 * that decade — without waiting on a live query that may be slow or empty. This
 * supplements the search-focused `CELEBRITY_DB` (which is tuned for matching a
 * typed name, not for blanketing every decade) with breadth: a spread of
 * notable people per decade across fields and the globe.
 *
 * Following the project convention, portraits are *not* hardcoded — entries
 * carry only `birthYear` + a short `blurb`. The image is fetched from the web
 * when a figure is actually added to the timeline (see usePeople.addPerson), so
 * this stays a compact, accurate index of who-when rather than a media bundle.
 * Names already in `CELEBRITY_DB` are intentionally not repeated here; the era
 * pool de-duplicates across both.
 */
export const ERA_FIGURES: CelebrityResult[] = [
  // —— 18th century (born 1700s) ———————————————————————————————————
  { name: "Voltaire", birthYear: 1694, deathYear: 1778, blurb: "Writer & philosopher" },
  { name: "Catherine the Great", birthYear: 1729, deathYear: 1796, blurb: "Empress of Russia" },
  { name: "Immanuel Kant", birthYear: 1724, deathYear: 1804, blurb: "Philosopher" },
  { name: "John Adams", birthYear: 1735, deathYear: 1826, blurb: "2nd U.S. President" },
  { name: "James Watt", birthYear: 1736, deathYear: 1819, blurb: "Engineer & inventor" },
  { name: "Joseph Haydn", birthYear: 1732, deathYear: 1809, blurb: "Composer" },

  // —— born 1760s–1790s ————————————————————————————————————————————
  { name: "Simón Bolívar", birthYear: 1783, deathYear: 1830, blurb: "Independence leader" },
  { name: "Mary Shelley", birthYear: 1797, deathYear: 1851, blurb: "Novelist" },
  { name: "Michael Faraday", birthYear: 1791, deathYear: 1867, blurb: "Physicist" },
  { name: "Franz Schubert", birthYear: 1797, deathYear: 1828, blurb: "Composer" },

  // —— born 1800s–1820s ————————————————————————————————————————————
  { name: "Edgar Allan Poe", birthYear: 1809, deathYear: 1849, blurb: "Writer" },
  { name: "Florence Nightingale", birthYear: 1820, deathYear: 1910, blurb: "Nursing pioneer" },
  { name: "Louis Pasteur", birthYear: 1822, deathYear: 1895, blurb: "Microbiologist" },
  { name: "Gregor Mendel", birthYear: 1822, deathYear: 1884, blurb: "Geneticist" },
  { name: "Frederick Douglass", birthYear: 1818, deathYear: 1895, blurb: "Abolitionist" },
  { name: "Harriet Tubman", birthYear: 1822, deathYear: 1913, blurb: "Abolitionist" },

  // —— born 1830s–1840s ————————————————————————————————————————————
  { name: "Pyotr Ilyich Tchaikovsky", birthYear: 1840, deathYear: 1893, blurb: "Composer" },
  { name: "Claude Monet", birthYear: 1840, deathYear: 1926, blurb: "Painter" },
  { name: "Alexander Graham Bell", birthYear: 1847, deathYear: 1922, blurb: "Inventor" },
  { name: "Auguste Rodin", birthYear: 1840, deathYear: 1917, blurb: "Sculptor" },

  // —— born 1850s–1860s ————————————————————————————————————————————
  { name: "Sigmund Freud", birthYear: 1856, deathYear: 1939, blurb: "Psychoanalyst" },
  { name: "Arthur Conan Doyle", birthYear: 1859, deathYear: 1930, blurb: "Novelist" },
  { name: "Theodore Roosevelt", birthYear: 1858, deathYear: 1919, blurb: "26th U.S. President" },
  { name: "Gustav Klimt", birthYear: 1862, deathYear: 1918, blurb: "Painter" },
  { name: "Henry Ford", birthYear: 1863, deathYear: 1947, blurb: "Industrialist" },
  { name: "Claude Debussy", birthYear: 1862, deathYear: 1918, blurb: "Composer" },

  // —— born 1870s ——————————————————————————————————————————————————
  { name: "Bertrand Russell", birthYear: 1872, deathYear: 1970, blurb: "Philosopher" },
  { name: "Sergei Rachmaninoff", birthYear: 1873, deathYear: 1943, blurb: "Composer & pianist" },
  { name: "Guglielmo Marconi", birthYear: 1874, deathYear: 1937, blurb: "Radio pioneer" },
  { name: "Carl Jung", birthYear: 1875, deathYear: 1961, blurb: "Psychiatrist" },

  // —— born 1880s ——————————————————————————————————————————————————
  { name: "Charlie Chaplin", birthYear: 1889, deathYear: 1977, blurb: "Filmmaker & actor" },
  { name: "Franklin D. Roosevelt", birthYear: 1882, deathYear: 1945, blurb: "32nd U.S. President" },
  { name: "Igor Stravinsky", birthYear: 1882, deathYear: 1971, blurb: "Composer" },
  { name: "Coco Chanel", birthYear: 1883, deathYear: 1971, blurb: "Fashion designer" },
  { name: "Niels Bohr", birthYear: 1885, deathYear: 1962, blurb: "Physicist" },
  { name: "Erwin Schrödinger", birthYear: 1887, deathYear: 1961, blurb: "Physicist" },
  { name: "Ludwig Wittgenstein", birthYear: 1889, deathYear: 1951, blurb: "Philosopher" },

  // —— born 1890s ——————————————————————————————————————————————————
  { name: "J.R.R. Tolkien", birthYear: 1892, deathYear: 1973, blurb: "Author" },
  { name: "Ernest Hemingway", birthYear: 1899, deathYear: 1961, blurb: "Novelist" },
  { name: "Alfred Hitchcock", birthYear: 1899, deathYear: 1980, blurb: "Filmmaker" },
  { name: "Agatha Christie", birthYear: 1890, deathYear: 1976, blurb: "Novelist" },
  { name: "Mao Zedong", birthYear: 1893, deathYear: 1976, blurb: "Revolutionary & leader" },
  { name: "George Gershwin", birthYear: 1898, deathYear: 1937, blurb: "Composer" },
  { name: "Dwight D. Eisenhower", birthYear: 1890, deathYear: 1969, blurb: "34th U.S. President" },

  // —— born 1900s ——————————————————————————————————————————————————
  { name: "Walt Disney", birthYear: 1901, deathYear: 1966, blurb: "Animator & producer" },
  { name: "Louis Armstrong", birthYear: 1901, deathYear: 1971, blurb: "Jazz musician" },
  { name: "George Orwell", birthYear: 1903, deathYear: 1950, blurb: "Author" },
  { name: "Salvador Dalí", birthYear: 1904, deathYear: 1989, blurb: "Painter" },
  { name: "J. Robert Oppenheimer", birthYear: 1904, deathYear: 1967, blurb: "Physicist" },
  { name: "John Steinbeck", birthYear: 1902, deathYear: 1968, blurb: "Novelist" },
  { name: "Grace Hopper", birthYear: 1906, deathYear: 1992, blurb: "Computer scientist" },
  { name: "Katharine Hepburn", birthYear: 1907, deathYear: 2003, blurb: "Actress" },
  { name: "Simone de Beauvoir", birthYear: 1908, deathYear: 1986, blurb: "Philosopher" },

  // —— born 1910s ——————————————————————————————————————————————————
  { name: "Alan Turing", birthYear: 1912, deathYear: 1954, blurb: "Computer scientist" },
  { name: "Rosa Parks", birthYear: 1913, deathYear: 2005, blurb: "Civil-rights activist" },
  { name: "Frank Sinatra", birthYear: 1915, deathYear: 1998, blurb: "Singer" },
  { name: "John F. Kennedy", birthYear: 1917, deathYear: 1963, blurb: "35th U.S. President" },
  { name: "Ronald Reagan", birthYear: 1911, deathYear: 2004, blurb: "40th U.S. President" },
  { name: "Mother Teresa", birthYear: 1910, deathYear: 1997, blurb: "Missionary" },
  { name: "Billie Holiday", birthYear: 1915, deathYear: 1959, blurb: "Jazz singer" },
  { name: "Orson Welles", birthYear: 1915, deathYear: 1985, blurb: "Filmmaker" },

  // —— born 1920s ——————————————————————————————————————————————————
  { name: "Marilyn Monroe", birthYear: 1926, deathYear: 1962, blurb: "Actress" },
  { name: "Martin Luther King Jr.", birthYear: 1929, deathYear: 1968, blurb: "Civil-rights leader" },
  { name: "Maya Angelou", birthYear: 1928, deathYear: 2014, blurb: "Poet & author" },
  { name: "Marlon Brando", birthYear: 1924, deathYear: 2004, blurb: "Actor" },
  { name: "Che Guevara", birthYear: 1928, deathYear: 1967, blurb: "Revolutionary" },
  { name: "Miles Davis", birthYear: 1926, deathYear: 1991, blurb: "Jazz musician" },
  { name: "Margaret Thatcher", birthYear: 1925, deathYear: 2013, blurb: "Prime Minister" },
  { name: "Isaac Asimov", birthYear: 1920, deathYear: 1992, blurb: "Author" },
  { name: "Fidel Castro", birthYear: 1926, deathYear: 2016, blurb: "Revolutionary & leader" },

  // —— born 1930s ——————————————————————————————————————————————————
  { name: "Elvis Presley", birthYear: 1935, deathYear: 1977, blurb: "Singer" },
  { name: "Neil Armstrong", birthYear: 1930, deathYear: 2012, blurb: "Astronaut" },
  { name: "Clint Eastwood", birthYear: 1930, blurb: "Actor & director" },
  { name: "Mikhail Gorbachev", birthYear: 1931, deathYear: 2022, blurb: "Soviet leader" },
  { name: "Elizabeth Taylor", birthYear: 1932, deathYear: 2011, blurb: "Actress" },
  { name: "Johnny Cash", birthYear: 1932, deathYear: 2003, blurb: "Singer" },
  { name: "Dalai Lama", birthYear: 1935, blurb: "Spiritual leader" },
  { name: "Anthony Hopkins", birthYear: 1937, blurb: "Actor" },
  { name: "Morgan Freeman", birthYear: 1937, blurb: "Actor" },

  // —— born 1940s ——————————————————————————————————————————————————
  { name: "John Lennon", birthYear: 1940, deathYear: 1980, blurb: "Musician" },
  { name: "Bob Dylan", birthYear: 1941, blurb: "Singer-songwriter" },
  { name: "Muhammad Ali", birthYear: 1942, deathYear: 2016, blurb: "Boxer" },
  { name: "Stephen Hawking", birthYear: 1942, deathYear: 2018, blurb: "Physicist" },
  { name: "Paul McCartney", birthYear: 1942, blurb: "Musician" },
  { name: "Jimi Hendrix", birthYear: 1942, deathYear: 1970, blurb: "Guitarist" },
  { name: "Robert De Niro", birthYear: 1943, blurb: "Actor" },
  { name: "Steven Spielberg", birthYear: 1946, blurb: "Filmmaker" },
  { name: "Freddie Mercury", birthYear: 1946, deathYear: 1991, blurb: "Singer" },
  { name: "David Bowie", birthYear: 1947, deathYear: 2016, blurb: "Musician" },
  { name: "Stephen King", birthYear: 1947, blurb: "Author" },
  { name: "Arnold Schwarzenegger", birthYear: 1947, blurb: "Actor & politician" },

  // —— born 1950s ——————————————————————————————————————————————————
  { name: "Bill Gates", birthYear: 1955, blurb: "Co-founder of Microsoft" },
  { name: "Tim Berners-Lee", birthYear: 1955, blurb: "Inventor of the Web" },
  { name: "Madonna", birthYear: 1958, blurb: "Singer" },
  { name: "Tom Hanks", birthYear: 1956, blurb: "Actor" },
  { name: "Prince", birthYear: 1958, deathYear: 2016, blurb: "Musician" },
  { name: "Vladimir Putin", birthYear: 1952, blurb: "President of Russia" },
  { name: "Tim Burton", birthYear: 1958, blurb: "Filmmaker" },
  { name: "Magic Johnson", birthYear: 1959, blurb: "Basketball player" },
  { name: "Ellen DeGeneres", birthYear: 1958, blurb: "Comedian & host" },

  // —— born 1960s ——————————————————————————————————————————————————
  { name: "Michael Jordan", birthYear: 1963, blurb: "Basketball player" },
  { name: "Princess Diana", birthYear: 1961, deathYear: 1997, blurb: "Princess of Wales" },
  { name: "Tom Cruise", birthYear: 1962, blurb: "Actor" },
  { name: "Brad Pitt", birthYear: 1963, blurb: "Actor" },
  { name: "Johnny Depp", birthYear: 1963, blurb: "Actor" },
  { name: "Quentin Tarantino", birthYear: 1963, blurb: "Filmmaker" },
  { name: "George Clooney", birthYear: 1961, blurb: "Actor" },
  { name: "Julia Roberts", birthYear: 1967, blurb: "Actress" },
  { name: "Will Smith", birthYear: 1968, blurb: "Actor" },
  { name: "Jeff Bezos", birthYear: 1964, blurb: "Founder of Amazon" },

  // —— born 1970s ——————————————————————————————————————————————————
  { name: "Tupac Shakur", birthYear: 1971, deathYear: 1996, blurb: "Rapper" },
  { name: "Eminem", birthYear: 1972, blurb: "Rapper" },
  { name: "Dwayne Johnson", birthYear: 1972, blurb: "Actor" },
  { name: "Angelina Jolie", birthYear: 1975, blurb: "Actress" },
  { name: "David Beckham", birthYear: 1975, blurb: "Footballer" },
  { name: "Kate Winslet", birthYear: 1975, blurb: "Actress" },
  { name: "Kanye West", birthYear: 1977, blurb: "Rapper & producer" },
  { name: "Shakira", birthYear: 1977, blurb: "Singer" },
  { name: "Kobe Bryant", birthYear: 1978, deathYear: 2020, blurb: "Basketball player" },
  { name: "Tom Brady", birthYear: 1977, blurb: "American-football player" },

  // —— born 1980s ——————————————————————————————————————————————————
  { name: "Rihanna", birthYear: 1988, blurb: "Singer" },
  { name: "Adele", birthYear: 1988, blurb: "Singer" },
  { name: "Usain Bolt", birthYear: 1986, blurb: "Sprinter" },
  { name: "Rafael Nadal", birthYear: 1986, blurb: "Tennis player" },
  { name: "Roger Federer", birthYear: 1981, blurb: "Tennis player" },
  { name: "Lady Gaga", birthYear: 1986, blurb: "Singer" },
  { name: "Mark Zuckerberg", birthYear: 1984, blurb: "Co-founder of Facebook" },
  { name: "Scarlett Johansson", birthYear: 1984, blurb: "Actress" },
  { name: "Drake", birthYear: 1986, blurb: "Rapper" },
  { name: "Kim Kardashian", birthYear: 1980, blurb: "Media personality" },
  { name: "Prince William", birthYear: 1982, blurb: "Prince of Wales" },

  // —— born 1990s ——————————————————————————————————————————————————
  { name: "Jennifer Lawrence", birthYear: 1990, blurb: "Actress" },
  { name: "Emma Watson", birthYear: 1990, blurb: "Actress" },
  { name: "Ariana Grande", birthYear: 1993, blurb: "Singer" },
  { name: "Justin Bieber", birthYear: 1994, blurb: "Singer" },
  { name: "Harry Styles", birthYear: 1994, blurb: "Singer" },
  { name: "Selena Gomez", birthYear: 1992, blurb: "Singer & actress" },
  { name: "Timothée Chalamet", birthYear: 1995, blurb: "Actor" },
  { name: "Tom Holland", birthYear: 1996, blurb: "Actor" },
  { name: "Dua Lipa", birthYear: 1995, blurb: "Singer" },
  { name: "Neymar", birthYear: 1992, blurb: "Footballer" },
  { name: "Kylian Mbappé", birthYear: 1998, blurb: "Footballer" },
  { name: "Kylie Jenner", birthYear: 1997, blurb: "Media personality" },

  // —— born 2000s ——————————————————————————————————————————————————
  { name: "Olivia Rodrigo", birthYear: 2003, blurb: "Singer" },
  { name: "Millie Bobby Brown", birthYear: 2004, blurb: "Actress" },
  { name: "Jude Bellingham", birthYear: 2003, blurb: "Footballer" },
  { name: "Coco Gauff", birthYear: 2004, blurb: "Tennis player" },
  { name: "Finn Wolfhard", birthYear: 2002, blurb: "Actor" },
  { name: "Iga Świątek", birthYear: 2001, blurb: "Tennis player" },
  { name: "Charli D'Amelio", birthYear: 2004, blurb: "Internet personality" },
  { name: "Lamine Yamal", birthYear: 2007, blurb: "Footballer" },
];
