import { Movie, Series, Clip, CastMember } from '../types';

const pexelsBase = 'https://images.pexels.com/photos';

const createCast = (actors: { name: string; namePersian: string; role: string }[]): CastMember[] =>
  actors.map((actor, i) => ({
    id: `cast-${i}`,
    ...actor,
    photo: `${pexelsBase}/${220 + i}53${50 + i}/pexels-photo-220${53 + i}${50 + i}.jpeg?auto=compress&cs=tinysrgb&w=300`,
  }));

export const movies: Movie[] = [
  {
    id: 'movie-1',
    title: 'The Last Stand',
    titlePersian: 'ایستگاه آخر',
    year: 2024,
    rating: 8.7,
    duration: 148,
    genres: ['Action', 'Drama', 'Thriller'],
    description: 'A gripping tale of survival and redemption set against the backdrop of post-revolutionary Iran. When a former soldier discovers a conspiracy that threatens everything he holds dear, he must confront his past to protect his family and his country. This cinematic masterpiece explores themes of loyalty, sacrifice, and the price of freedom.',
    poster: `${pexelsBase}/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Amir Hossein', namePersian: 'امیر حسین', role: 'Reza Ahmadi' },
      { name: 'Sara Rahimi', namePersian: 'سارا رحیمی', role: 'Maryam' },
      { name: 'Ali Rezaei', namePersian: 'علی رضایی', role: 'Colonel Farhadi' },
      { name: 'Mina Kazemi', namePersian: 'مینا کاظمی', role: 'Leila' },
    ]),
    director: 'Bahram Radan',
    country: 'Iran',
    language: 'Persian',
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'movie-2',
    title: 'Shadows of Tehran',
    titlePersian: 'سایه‌های تهران',
    year: 2024,
    rating: 8.2,
    duration: 132,
    genres: ['Crime', 'Drama', 'Mystery'],
    description: 'In the neon-lit streets of modern Tehran, a detective unravels a web of corruption that reaches the highest levels of power. Each clue leads deeper into the darkness, blurring the line between justice and revenge.',
    poster: `${pexelsBase}/3311884/pexels-photo-3311884.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/3311884/pexels-photo-3311884.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Parviz Parastui', namePersian: 'پرویز پرستویی', role: 'Detective Majidi' },
      { name: 'Taraneh Alidoosti', namePersian: 'ترانه علیدوستی', role: 'Narges' },
    ]),
    director: 'Asghar Farhadi',
    country: 'Iran',
    language: 'Persian',
    isTrending: true,
  },
  {
    id: 'movie-3',
    title: 'Desert Wind',
    titlePersian: 'باد صحرا',
    year: 2023,
    rating: 7.9,
    duration: 118,
    genres: ['Drama', 'Romance'],
    description: 'A poetic love story spanning decades, from the golden deserts of Yazd to the bustling streets of modern Isfahan. Two souls separated by fate find their way back through the whispers of the desert wind.',
    poster: `${pexelsBase}/1663780/pexels-photo-1663780.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/1663780/pexels-photo-1663780.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Golshifteh Farahani', namePersian: 'گلشیفته فراهانی', role: 'Simin' },
      { name: 'Shahab Hosseini', namePersian: 'شهاب حسینی', role: 'Amir' },
    ]),
    director: 'Majid Majidi',
    country: 'Iran',
    language: 'Persian',
  },
  {
    id: 'movie-4',
    title: 'Night Watch',
    titlePersian: 'نگهبان شب',
    year: 2024,
    rating: 8.5,
    duration: 156,
    genres: ['Thriller', 'Action'],
    description: 'When a dedicated police officer stumbles upon a criminal empire operating under the cover of night, he must choose between his duty and his safety. A heart-pounding thriller that keeps you on the edge.',
    poster: `${pexelsBase}/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Navid Mohammadzadeh', namePersian: 'نوید محمدزاده', role: 'Officer Karimi' },
      { name: 'Mona Zandi', namePersian: 'مونا زندی', role: 'Sara' },
    ]),
    director: 'Saeed Roustayi',
    country: 'Iran',
    language: 'Persian',
    isNewRelease: true,
  },
  {
    id: 'movie-5',
    title: 'The Golden Cage',
    titlePersian: 'قفس طلایی',
    year: 2024,
    rating: 8.9,
    duration: 142,
    genres: ['Drama', 'Family'],
    description: 'A wealthy family\'s facade begins to crumble when buried secrets come to light during a birthday celebration. Award-winning performances explore the complexity of family bonds and social expectations.',
    poster: `${pexelsBase}/1813273/pexels-photo-1813273.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/1813273/pexels-photo-1813273.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Leila Hatami', namePersian: 'لیلا حاتمی', role: 'Parvin' },
      { name: 'Peyman Moaadi', namePersian: 'پیمان معادی', role: 'Hossein' },
      { name: 'Sareh Bayat', namePersian: 'ساره بیات', role: 'Mahnaz' },
    ]),
    director: 'Mani Haghighi',
    country: 'Iran',
    language: 'Persian',
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'movie-6',
    title: 'Echoes of War',
    titlePersian: 'پژواک جنگ',
    year: 2023,
    rating: 8.1,
    duration: 165,
    genres: ['War', 'Drama'],
    description: 'Based on true events, this powerful war drama follows a group of soldiers during the Iran-Iraq war, exploring themes of brotherhood, sacrifice, and the human cost of conflict.',
    poster: `${pexelsBase}/235615/pexels-photo-235615.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/235615/pexels-photo-235615.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Babak Hamidian', namePersian: 'بابک حمیدیان', role: 'Captain Morteza' },
      { name: 'Merila Zarei', namePersian: 'مریم زارعی', role: 'Zahra' },
    ]),
    director: 'Ebrahim Hatamikia',
    country: 'Iran',
    language: 'Persian',
  },
  {
    id: 'movie-7',
    title: 'Crimson Sky',
    titlePersian: 'آسمان سرخ',
    year: 2024,
    rating: 7.6,
    duration: 128,
    genres: ['Sci-Fi', 'Adventure'],
    description: 'In a future where humanity has colonized Mars, an Iranian scientist discovers a threat that could change the course of history. A groundbreaking science fiction epic.',
    poster: `${pexelsBase}/73873/pexels-photo-73873.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/73873/pexels-photo-73873.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Ashkan Khatibi', namePersian: 'اشکان خطیبی', role: 'Dr. Arash' },
      { name: 'Negar Javaherian', namePersian: 'نگار جواهریان', role: 'Engineer Sara' },
    ]),
    director: 'Ali Vazirian',
    country: 'Iran',
    language: 'Persian',
    isNewRelease: true,
  },
  {
    id: 'movie-8',
    title: 'Whispers in the Mist',
    titlePersian: 'نجوا در مه',
    year: 2023,
    rating: 8.3,
    duration: 134,
    genres: ['Mystery', 'Drama'],
    description: 'A remote village shrouded in mist holds dark secrets. When a journalist arrives to investigate a cold case, she uncovers truths that will change her life forever.',
    poster: `${pexelsBase}/1115128/pexels-photo-1115128.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/1115128/pexels-photo-1115128.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Nazanin Boniadi', namePersian: 'نازنین بندیادی', role: 'Journalist Leyla' },
      { name: 'Farhad Aslani', namePersian: 'فرهاد اصلانی', role: 'Elder Hassan' },
    ]),
    director: 'Rakhshan Banietemad',
    country: 'Iran',
    language: 'Persian',
  },
  {
    id: 'movie-9',
    title: 'The Wanderer',
    titlePersian: 'ولگرد',
    year: 2024,
    rating: 7.8,
    duration: 119,
    genres: ['Adventure', 'Drama'],
    description: 'A young man embarks on a journey across Iran\'s diverse landscapes, seeking answers to life\'s biggest questions. A visual meditation on faith and purpose.',
    poster: `${pexelsBase}/2104249/pexels-photo-2104249.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/2104249/pexels-photo-2104249.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Hamid Farrokhnejad', namePersian: 'حمید فرخ‌نژاد', role: 'The Wanderer' },
    ]),
    director: 'Kamal Tabrizi',
    country: 'Iran',
    language: 'Persian',
    isNewRelease: true,
  },
  {
    id: 'movie-10',
    title: 'Beyond the Horizon',
    titlePersian: 'فراز افق',
    year: 2023,
    rating: 8.4,
    duration: 152,
    genres: ['Drama', 'Romance'],
    description: 'Two artists from opposite worlds find love in the ancient city of Shiraz. Their passion for art and each other transcends social barriers in this award-winning romantic drama.',
    poster: `${pexelsBase}/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Mahnaz Afshar', namePersian: 'مهناز افشار', role: 'Roya' },
      { name: 'Javad Ezati', namePersian: 'جواد عزتی', role: 'Kamal' },
    ]),
    director: 'Fereydoun Jeirani',
    country: 'Iran',
    language: 'Persian',
  },
];

export const series: Series[] = [
  {
    id: 'series-1',
    title: 'The Capital',
    titlePersian: 'پایتخت',
    year: 2011,
    rating: 9.1,
    genres: ['Comedy', 'Drama', 'Family'],
    description: 'Iran\'s most beloved comedy series follows the misadventures of Naqi and Arastoo as they navigate life in modern Tehran. Family, friendship, and hilarious situations make this a cultural phenomenon.',
    poster: `${pexelsBase}/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Mohammad Reza Golzar', namePersian: 'محمد رضا گلزار', role: 'Naqi' },
      { name: 'Ahmed Mehrabi', namePersian: 'احمد محرابی', role: 'Arastoo' },
    ]),
    creator: 'Sirous Moghaddam',
    seasons: [
      {
        number: 1,
        year: 2011,
        episodes: [
          { number: 1, title: 'Arrival', titlePersian: 'ورود', duration: 45, description: 'Naqi arrives in Tehran with dreams of success.', thumbnail: `${pexelsBase}/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=400` },
          { number: 2, title: 'First Job', titlePersian: 'اولین کار', duration: 42, description: 'Naqi\'s first day at work brings unexpected challenges.', thumbnail: `${pexelsBase}/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=400` },
          { number: 3, title: 'The Neighbor', titlePersian: 'همسایه', duration: 40, description: 'A mysterious neighbor moves in next door.', thumbnail: `${pexelsBase}/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=400` },
        ],
      },
      {
        number: 2,
        year: 2012,
        episodes: [
          { number: 1, title: 'New Beginnings', titlePersian: 'آغازی نو', duration: 44, description: 'Season 2 brings new adventures.', thumbnail: `${pexelsBase}/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=400` },
          { number: 2, title: 'Family Matters', titlePersian: 'مسائل خانوادگی', duration: 46, description: 'Family drama takes center stage.', thumbnail: `${pexelsBase}/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=400` },
        ],
      },
    ],
    status: 'ongoing',
    country: 'Iran',
    language: 'Persian',
    isPopular: true,
  },
  {
    id: 'series-2',
    title: 'Paytakht',
    titlePersian: 'شهرزاد',
    year: 2015,
    rating: 8.8,
    genres: ['Drama', 'Romance', 'Historical'],
    description: 'Set in 1950s Iran, this sweeping romantic drama tells the story of Shahrazad, a young woman whose love story defies the conventions of her time. A masterpiece of Persian television.',
    poster: `${pexelsBase}/2872277/pexels-photo-2872277.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/2872277/pexels-photo-2872277.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Taraneh Alidoosti', namePersian: 'ترانه علیدوستی', role: 'Shahrazad' },
      { name: 'Shahab Hosseini', namePersian: 'شهاب حسینی', role: 'Farhad' },
    ]),
    creator: 'Hassan Fathi',
    seasons: [
      {
        number: 1,
        year: 2015,
        episodes: [
          { number: 1, title: 'The Beginning', titlePersian: 'آغاز', duration: 55, description: 'Shahrazad\'s story begins.', thumbnail: `${pexelsBase}/2872277/pexels-photo-2872277.jpeg?auto=compress&cs=tinysrgb&w=400` },
          { number: 2, title: 'The Encounter', titlePersian: 'رویا', duration: 52, description: 'Fate brings two souls together.', thumbnail: `${pexelsBase}/2872277/pexels-photo-2872277.jpeg?auto=compress&cs=tinysrgb&w=400` },
        ],
      },
    ],
    status: 'completed',
    country: 'Iran',
    language: 'Persian',
    isPopular: true,
  },
  {
    id: 'series-3',
    title: 'Joker',
    titlePersian: 'جوکر',
    year: 2021,
    rating: 8.5,
    genres: ['Comedy', 'Drama'],
    description: 'A heartwarming comedy-drama about a down-on-his-luck actor who finds an unusual way to make ends meet while pursuing his dreams.',
    poster: `${pexelsBase}/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Amir Jafari', namePersian: 'امیر جعفری', role: 'Jafar' },
      { name: 'Javad Hashemi', namePersian: 'جواد هاشمی', role: 'Reza' },
    ]),
    creator: 'Ahmad Khashan',
    seasons: [
      {
        number: 1,
        year: 2021,
        episodes: [
          { number: 1, title: 'Pilot', titlePersian: 'آزمایشی', duration: 38, description: 'Jafar\'s unusual journey begins.', thumbnail: `${pexelsBase}/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=400` },
        ],
      },
    ],
    status: 'ongoing',
    country: 'Iran',
    language: 'Persian',
    isPopular: true,
  },
  {
    id: 'series-4',
    title: 'Zero Degree Turn',
    titlePersian: ' zerdegeye sefr',
    year: 2007,
    rating: 8.9,
    genres: ['Drama', 'Historical', 'War'],
    description: 'Hassan Fathi\'s epic masterpiece follows a Palestinian man\'s struggle for his homeland and his people\'s rights. An important historical drama.',
    poster: `${pexelsBase}/2259917/pexels-photo-2259917.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/2259917/pexels-photo-2259917.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Babak Hamidian', namePersian: 'بابک حمیدیان', role: 'Musa' },
      { name: 'Mona Zandi', namePersian: 'مونا زندی', role: 'Sarah' },
    ]),
    creator: 'Hassan Fathi',
    seasons: [
      {
        number: 1,
        year: 2007,
        episodes: [
          { number: 1, title: 'The Promise', titlePersian: 'قول', duration: 60, description: 'A promise that changed everything.', thumbnail: `${pexelsBase}/2259917/pexels-photo-2259917.jpeg?auto=compress&cs=tinysrgb&w=400` },
        ],
      },
    ],
    status: 'completed',
    country: 'Iran',
    language: 'Persian',
  },
  {
    id: 'series-5',
    title: 'Mannequin',
    titlePersian: 'مانکن',
    year: 2023,
    rating: 7.9,
    genres: ['Drama', 'Mystery'],
    description: 'A psychological thriller series exploring the dark side of the fashion industry in Iran. When models start disappearing, a determined investigator uncovers a web of secrets.',
    poster: `${pexelsBase}/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Negar Javaherian', namePersian: 'نگار جواهریان', role: 'Detective Noushin' },
      { name: 'Merila Zarei', namePersian: 'مریم زارعی', role: 'Designer Parisa' },
    ]),
    creator: 'Mona Zandi',
    seasons: [
      {
        number: 1,
        year: 2023,
        episodes: [
          { number: 1, title: 'The Model', titlePersian: 'مدل', duration: 48, description: 'A model vanishes without a trace.', thumbnail: `${pexelsBase}/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400` },
        ],
      },
    ],
    status: 'ongoing',
    country: 'Iran',
    language: 'Persian',
  },
  {
    id: 'series-6',
    title: 'Night Manager',
    titlePersian: 'مدیر شب',
    year: 2022,
    rating: 8.2,
    genres: ['Crime', 'Drama'],
    description: 'The manager of a luxury hotel in northern Tehran gets entangled with dangerous guests and underground dealings. A suspenseful crime drama.',
    poster: `${pexelsBase}/262045/pexels-photo-262045.jpeg?auto=compress&cs=tinysrgb&w=600`,
    backdrop: `${pexelsBase}/262045/pexels-photo-262045.jpeg?auto=compress&cs=tinysrgb&w=1920`,
    trailer: 'https://example.com/trailer',
    cast: createCast([
      { name: 'Babak Karimi', namePersian: 'بابک کیمیا', role: 'Manager Behrouz' },
    ]),
    creator: 'Saeed Roustayi',
    seasons: [
      {
        number: 1,
        year: 2022,
        episodes: [
          { number: 1, title: 'Check In', titlePersian: 'چک این', duration: 50, description: 'A new guest checks in with secrets.', thumbnail: `${pexelsBase}/262045/pexels-photo-262045.jpeg?auto=compress&cs=tinysrgb&w=400` },
        ],
      },
    ],
    status: 'ongoing',
    country: 'Iran',
    language: 'Persian',
  },
];

export const clips: Clip[] = [
  {
    id: 'clip-1',
    movieId: 'movie-1',
    title: 'The Last Stand - Epic Final Battle Scene',
    thumbnail: `${pexelsBase}/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=400`,
    videoUrl: 'https://example.com/video',
    duration: 45,
    likes: 125000,
    saves: 45000,
    shares: 23000,
  },
  {
    id: 'clip-2',
    movieId: 'movie-2',
    title: 'Shadows of Tehran - Detective\'s Discovery',
    thumbnail: `${pexelsBase}/3311884/pexels-photo-3311884.jpeg?auto=compress&cs=tinysrgb&w=400`,
    videoUrl: 'https://example.com/video',
    duration: 38,
    likes: 98000,
    saves: 32000,
    shares: 18000,
  },
  {
    id: 'clip-3',
    movieId: 'movie-5',
    title: 'The Golden Cage - Family Dinner Scene',
    thumbnail: `${pexelsBase}/1813273/pexels-photo-1813273.jpeg?auto=compress&cs=tinysrgb&w=400`,
    videoUrl: 'https://example.com/video',
    duration: 52,
    likes: 156000,
    saves: 67000,
    shares: 31000,
  },
  {
    id: 'clip-4',
    movieId: 'movie-4',
    title: 'Night Watch - Intense Chase Sequence',
    thumbnail: `${pexelsBase}/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=400`,
    videoUrl: 'https://example.com/video',
    duration: 35,
    likes: 89000,
    saves: 28000,
    shares: 15000,
  },
  {
    id: 'clip-5',
    movieId: 'movie-3',
    title: 'Desert Wind - Romantic Dance Scene',
    thumbnail: `${pexelsBase}/1663780/pexels-photo-1663780.jpeg?auto=compress&cs=tinysrgb&w=400`,
    videoUrl: 'https://example.com/video',
    duration: 42,
    likes: 201000,
    saves: 89000,
    shares: 45000,
  },
  {
    id: 'clip-6',
    movieId: 'movie-6',
    title: 'Echoes of War - Emotional Farewell',
    thumbnail: `${pexelsBase}/235615/pexels-photo-235615.jpeg?auto=compress&cs=tinysrgb&w=400`,
    videoUrl: 'https://example.com/video',
    duration: 48,
    likes: 134000,
    saves: 56000,
    shares: 29000,
  },
];

export const genres = [
  'Action', 'Drama', 'Comedy', 'Thriller', 'Horror',
  'Romance', 'Sci-Fi', 'Animation', 'Documentary', 'Crime',
  'Adventure', 'Fantasy', 'Mystery', 'Family'
];

export const getFeaturedBanner = () => movies.find(m => m.isFeatured) || movies[0];

export const getTrendingMovies = () => movies.filter(m => m.isTrending);

export const getNewReleases = () => movies.filter(m => m.isNewRelease);

export const getPopularSeries = () => series.filter(s => s.isPopular);

export const getTopRated = () => [...movies, ...series].sort((a, b) => b.rating - a.rating).slice(0, 10);

export const getMovieById = (id: string) => movies.find(m => m.id === id);

export const getSeriesById = (id: string) => series.find(s => s.id === id);

export const getSimilarMovies = (movieId: string) => {
  const movie = getMovieById(movieId);
  if (!movie) return [];
  return movies.filter(m =>
    m.id !== movieId && m.genres.some(g => movie.genres.includes(g))
  ).slice(0, 6);
};

export const getRelatedSeries = (seriesId: string) => {
  const show = getSeriesById(seriesId);
  if (!show) return [];
  return series.filter(s =>
    s.id !== seriesId && s.genres.some(g => show.genres.includes(g))
  ).slice(0, 6);
};

export const searchContent = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  const movieResults = movies.filter(m =>
    m.title.toLowerCase().includes(lowercaseQuery) ||
    m.titlePersian.includes(query) ||
    m.genres.some(g => g.toLowerCase().includes(lowercaseQuery)) ||
    m.cast.some(c => c.name.toLowerCase().includes(lowercaseQuery) || c.namePersian.includes(query))
  );
  const seriesResults = series.filter(s =>
    s.title.toLowerCase().includes(lowercaseQuery) ||
    s.titlePersian.includes(query) ||
    s.genres.some(g => g.toLowerCase().includes(lowercaseQuery))
  );
  return { movies: movieResults, series: seriesResults };
};

export const getContentByGenre = (genre: string) => ({
  movies: movies.filter(m => m.genres.includes(genre)),
  series: series.filter(s => s.genres.includes(genre)),
});
