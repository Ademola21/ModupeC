import type { Movie, Comment } from './types';

export const genreList: string[] = ['All Popular', 'Action', 'Animation', 'Adventure', 'Horror', 'Documentary', 'Romance', 'Kids', 'Comedy'];

export const mockAvatars: string[] = [
  'https://i.pravatar.cc/150?u=avatar1',
  'https://i.pravatar.cc/150?u=avatar2',
  'https://i.pravatar.cc/150?u=avatar3',
  'https://i.pravatar.cc/150?u=avatar4',
  'https://i.pravatar.cc/150?u=avatar5',
  'https://i.pravatar.cc/150?u=avatar6',
  'https://i.pravatar.cc/150?u=avatar7',
  'https://i.pravatar.cc/150?u=avatar8',
  'https://i.pravatar.cc/150?u=avatar9',
  'https://i.pravatar.cc/150?u=avatar10',
];

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Monsters, INC.',
    posterUrl: 'https://i.ytimg.com/vi/NcyF8ZP8MmY/maxresdefault.jpg',
    rating: 8.1,
    year: 2001,
    genres: ['Animation', 'Comedy', 'Family'],
    description: 'In Monstropolis, a city of monsters with no humans, the city is powered by the scariest monsters who enter the human world to scare children and harvest their screams. But the children are toxic to the monsters, and after a child gets through, two monsters realize things may not be what they think.',
    trailerUrl: 'https://www.youtube.com/embed/cvOQeozL4S0',
    cast: [
      { name: 'John Goodman', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
      { name: 'Billy Crystal', avatarUrl: 'https://i.pravatar.cc/150?u=2' },
      { name: 'Mary Gibbs', avatarUrl: 'https://i.pravatar.cc/150?u=3' },
      { name: 'Steve Buscemi', avatarUrl: 'https://i.pravatar.cc/150?u=4' },
      { name: 'James Coburn', avatarUrl: 'https://i.pravatar.cc/150?u=5' },
    ]
  },
  {
    id: 2,
    title: 'The Good Dinosaur',
    posterUrl: 'https://i.ytimg.com/vi/RW1PdwCuqAc/maxresdefault.jpg',
    rating: 6.7,
    year: 2015,
    genres: ['Animation', 'Family', 'Adventure'],
    description: 'An epic journey into the world of dinosaurs where an Apatosaurus named Arlo makes an unlikely human friend.',
    trailerUrl: 'https://www.youtube.com/embed/O-RgquKVTPE',
    cast: [
       { name: 'Raymond Ochoa', avatarUrl: 'https://i.pravatar.cc/150?u=6' },
       { name: 'Jack Bright', avatarUrl: 'https://i.pravatar.cc/150?u=7' },
       { name: 'Sam Elliott', avatarUrl: 'https://i.pravatar.cc/150?u=8' },
    ]
  },
  {
    id: 3,
    title: 'Aladdin',
    posterUrl: 'https://i.ytimg.com/vi/ghDowUhK-tE/maxresdefault.jpg',
    rating: 7.6,
    year: 1992,
    genres: ['Animation', 'Family', 'Fantasy'],
    description: 'A kind-hearted street urchin and a power-hungry Grand Vizier vie for a magic lamp that has the power to make their deepest wishes come true.',
    trailerUrl: 'https://www.youtube.com/embed/HlA9Jlt2d2M',
    cast: [
        { name: 'Scott Weinger', avatarUrl: 'https://i.pravatar.cc/150?u=9' },
        { name: 'Robin Williams', avatarUrl: 'https://i.pravatar.cc/150?u=10' },
        { name: 'Linda Larkin', avatarUrl: 'https://i.pravatar.cc/150?u=11' },
    ]
  },
  {
    id: 4,
    title: 'Raya and the Last Dragon',
    posterUrl: 'https://i.ytimg.com/vi/WJal2M9uWrI/maxresdefault.jpg',
    rating: 8.0,
    year: 2021,
    part: 1,
    genres: ['Animation', 'Family', 'Fantasy'],
    description: 'In a realm known as Kumandra, a re-imagined Earth inhabited by an ancient civilization, a warrior named Raya is determined to find the last dragon.',
    trailerUrl: 'https://www.youtube.com/embed/1VIZ89FEjYI',
    cast: [
        { name: 'Kelly Marie Tran', avatarUrl: 'https://i.pravatar.cc/150?u=12' },
        { name: 'Awkwafina', avatarUrl: 'https://i.pravatar.cc/150?u=13' },
        { name: 'Gemma Chan', avatarUrl: 'https://i.pravatar.cc/150?u=14' },
    ]
  },
  {
    id: 5,
    title: 'Luca',
    posterUrl: 'https://i.ytimg.com/vi/6CjsQBKpe98/maxresdefault.jpg',
    rating: 7.9,
    year: 2021,
    genres: ['Animation', 'Comedy', 'Family'],
    description: 'On the Italian Riviera, an unlikely but strong friendship grows between a human being and a sea monster disguised as a human.',
    trailerUrl: 'https://www.youtube.com/embed/mYfJxlgR2jw',
     cast: [
        { name: 'Jacob Tremblay', avatarUrl: 'https://i.pravatar.cc/150?u=15' },
        { name: 'Jack Dylan Grazer', avatarUrl: 'https://i.pravatar.cc/150?u=16' },
        { name: 'Emma Berman', avatarUrl: 'https://i.pravatar.cc/150?u=17' },
    ]
  },
  {
    id: 6,
    title: 'Tangled',
    posterUrl: 'https://i.ytimg.com/vi/tWRZyt1tsas/maxresdefault.jpg',
    rating: 7.6,
    year: 2010,
    genres: ['Animation', 'Family'],
    description: 'The magically long-haired Rapunzel has spent her entire life in a tower, but now that a runaway thief has stumbled upon her, she is about to discover the world for the first time, and who she really is.',
    trailerUrl: 'https://www.youtube.com/embed/py6ys6oUroM',
    cast: [
        { name: 'Mandy Moore', avatarUrl: 'https://i.pravatar.cc/150?u=18' },
        { name: 'Zachary Levi', avatarUrl: 'https://i.pravatar.cc/150?u=19' },
        { name: 'Donna Murphy', avatarUrl: 'https://i.pravatar.cc/150?u=20' },
    ]
  },
  {
    id: 8,
    title: 'Coco',
    posterUrl: 'https://i.ytimg.com/vi/ykoeiZQHvKw/maxresdefault.jpg',
    rating: 8.2,
    year: 2017,
    genres: ['Animation', 'Family', 'Fantasy'],
    description: 'Despite his family’s baffling generations-old ban on music, aspiring musician Miguel dreams of becoming an accomplished musician like his idol, Ernesto de la Cruz.',
    trailerUrl: 'https://www.youtube.com/embed/Ga6RYejo6Hk',
    cast: [
        { name: 'Anthony Gonzalez', avatarUrl: 'https://i.pravatar.cc/150?u=21' },
        { name: 'Gael García Bernal', avatarUrl: 'https://i.pravatar.cc/150?u=22' },
        { name: 'Benjamin Bratt', avatarUrl: 'https://i.pravatar.cc/150?u=23' },
    ]
  },
  {
    id: 9,
    title: 'The Flash',
    posterUrl: 'https://i.ytimg.com/vi/fBRwXSOlwwc/maxresdefault.jpg',
    rating: 6.8,
    year: 2023,
    part: 2,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    description: 'Worlds collide when Barry Allen uses his superpowers to travel back in time in order to change the events of the past.',
    trailerUrl: 'https://www.youtube.com/embed/hebWYacbdvc',
    cast: [
        { name: 'Ezra Miller', avatarUrl: 'https://i.pravatar.cc/150?u=24' },
        { name: 'Michael Keaton', avatarUrl: 'https://i.pravatar.cc/150?u=25' },
        { name: 'Sasha Calle', avatarUrl: 'https://i.pravatar.cc/150?u=26' },
    ]
  },
   {
    id: 10,
    title: 'Kandahar',
    posterUrl: 'https://i.ytimg.com/vi/DUb0E4NhxIY/maxresdefault.jpg',
    rating: 6.3,
    year: 2023,
    genres: ['Action', 'Thriller'],
    description: 'An undercover CIA operative gets stuck in hostile territory in Afghanistan after his mission is exposed.',
    trailerUrl: 'https://www.youtube.com/embed/I-6A2M_b0gQ',
    cast: [
        { name: 'Gerard Butler', avatarUrl: 'https://i.pravatar.cc/150?u=27' },
        { name: 'Navid Negahban', avatarUrl: 'https://i.pravatar.cc/150?u=28' },
        { name: 'Ali Fazal', avatarUrl: 'https://i.pravatar.cc/150?u=29' },
    ]
  },
  {
    id: 11,
    title: 'Up',
    posterUrl: 'https://i.ytimg.com/vi/VIba_yg-yiA/maxresdefault.jpg',
    rating: 8.3,
    year: 2009,
    genres: ['Animation', 'Adventure', 'Comedy'],
    description: 'Seventy-eight year old Carl Fredricksen travels to Paradise Falls in his home equipped with balloons, inadvertently taking a young stowaway.',
    trailerUrl: 'https://www.youtube.com/embed/pkqzFUhGPJg',
    cast: [
        { name: 'Ed Asner', avatarUrl: 'https://i.pravatar.cc/150?u=30' },
        { name: 'Jordan Nagai', avatarUrl: 'https://i.pravatar.cc/150?u=31' },
        { name: 'Christopher Plummer', avatarUrl: 'https://i.pravatar.cc/150?u=32' },
    ]
  },
  {
    id: 12,
    title: 'Inside Out',
    posterUrl: 'https://i.ibb.co/51rR5D1/t-GNj-DF-S-i-J-S-Z-s-F-s-G-w-F-k-W-n-k-C.jpg',
    rating: 8.1,
    year: 2015,
    genres: ['Animation', 'Adventure', 'Comedy'],
    description: 'After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house, and school.',
    trailerUrl: 'https://www.youtube.com/embed/yRUAzGQ3nSY',
    cast: [
        { name: 'Amy Poehler', avatarUrl: 'https://i.pravatar.cc/150?u=33' },
        { name: 'Phyllis Smith', avatarUrl: 'https://i.pravatar.cc/150?u=34' },
        { name: 'Richard Kind', avatarUrl: 'https://i.pravatar.cc/150?u=35' },
    ]
  },
  {
    id: 13,
    title: 'WALL-E',
    posterUrl: 'https://i.ibb.co/8P794sL/6-J-N-n-IZ2-No-Ue-O4-I-f-D-o-T-v-J.jpg',
    rating: 8.4,
    year: 2008,
    genres: ['Animation', 'Adventure', 'Family'],
    description: 'In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.',
    trailerUrl: 'https://www.youtube.com/embed/alIq_wG9FNk',
    cast: [
        { name: 'Ben Burtt', avatarUrl: 'https://i.pravatar.cc/150?u=36' },
        { name: 'Elissa Knight', avatarUrl: 'https://i.pravatar.cc/150?u=37' },
        { name: 'Jeff Garlin', avatarUrl: 'https://i.pravatar.cc/150?u=38' },
    ]
  },
  {
    id: 14,
    title: 'The Flash',
    posterUrl: 'https://i.ibb.co/68ZzXwR/MV5-BOWNh-M2-E3-OGIt-Ym-U4-YS00-YW-NmLWJi-ODQt-M2-Fk-Y2-I2-Yj-Y2-Nj-Fm-Xk-Ey-Xk-Fqc-Gde-QXVy-ODk4-OT-U3-NQ-V1.jpg',
    rating: 7.5,
    year: 2014,
    part: 1,
    genres: ['Action', 'Adventure', 'Drama'],
    description: 'After being struck by lightning, Barry Allen wakes up from his coma to discover he\'s been given the power of super speed, becoming the Flash, fighting crime in Central City.',
    trailerUrl: 'https://www.youtube.com/embed/Yj0l7iGKh8g',
    cast: [
        { name: 'Grant Gustin', avatarUrl: 'https://i.pravatar.cc/150?u=39' },
        { name: 'Candice Patton', avatarUrl: 'https://i.pravatar.cc/150?u=40' },
        { name: 'Danielle Panabaker', avatarUrl: 'https://i.pravatar.cc/150?u=41' },
    ]
  },
  {
    id: 15,
    title: 'Raya and the Last Dragon',
    posterUrl: 'https://i.ibb.co/Cbf0D4h/good-dino-4.jpg',
    rating: 8.2,
    year: 2024,
    part: 2,
    genres: ['Animation', 'Family', 'Fantasy'],
    description: 'Raya and Sisu embark on a new adventure to restore balance to the lands beyond Kumandra, facing a new mystical threat.',
    trailerUrl: 'https://www.youtube.com/embed/1VIZ89FEjYI',
    cast: [
        { name: 'Kelly Marie Tran', avatarUrl: 'https://i.pravatar.cc/150?u=12' },
        { name: 'Awkwafina', avatarUrl: 'https://i.pravatar.cc/150?u=13' },
        { name: 'Gemma Chan', avatarUrl: 'https://i.pravatar.cc/150?u=14' },
    ]
  }
];

export const newReleasesMovies: Movie[] = [
  {
    id: 9,
    title: 'The Flash',
    posterUrl: 'https://i.ytimg.com/vi/fBRwXSOlwwc/maxresdefault.jpg',
    rating: 6.8,
    year: 2023,
    part: 2,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    description: 'Worlds collide when Barry Allen uses his superpowers to travel back in time in order to change the events of the past.',
    trailerUrl: 'https://www.youtube.com/embed/hebWYacbdvc',
    cast: [
        { name: 'Ezra Miller', avatarUrl: 'https://i.pravatar.cc/150?u=24' },
        { name: 'Michael Keaton', avatarUrl: 'https://i.pravatar.cc/150?u=25' },
        { name: 'Sasha Calle', avatarUrl: 'https://i.pravatar.cc/150?u=26' },
    ]
  },
  {
    id: 10,
    title: 'Kandahar',
    posterUrl: 'https://i.ytimg.com/vi/DUb0E4NhxIY/maxresdefault.jpg',
    rating: 6.3,
    year: 2023,
    genres: ['Action', 'Thriller'],
    description: 'An undercover CIA operative gets stuck in hostile territory in Afghanistan after his mission is exposed.',
    trailerUrl: 'https://www.youtube.com/embed/I-6A2M_b0gQ',
    cast: [
        { name: 'Gerard Butler', avatarUrl: 'https://i.pravatar.cc/150?u=27' },
        { name: 'Navid Negahban', avatarUrl: 'https://i.pravatar.cc/150?u=28' },
        { name: 'Ali Fazal', avatarUrl: 'https://i.pravatar.cc/150?u=29' },
    ]
  },
  {
    id: 4,
    title: 'Raya and the Last Dragon',
    posterUrl: 'https://i.ytimg.com/vi/WJal2M9uWrI/maxresdefault.jpg',
    rating: 8.0,
    year: 2021,
    part: 1,
    genres: ['Animation', 'Family', 'Fantasy'],
    description: 'In a realm known as Kumandra, a re-imagined Earth inhabited by an ancient civilization, a warrior named Raya is determined to find the last dragon.',
    trailerUrl: 'https://www.youtube.com/embed/1VIZ89FEjYI',
    cast: [
        { name: 'Kelly Marie Tran', avatarUrl: 'https://i.pravatar.cc/150?u=12' },
        { name: 'Awkwafina', avatarUrl: 'https://i.pravatar.cc/150?u=13' },
        { name: 'Gemma Chan', avatarUrl: 'https://i.pravatar.cc/150?u=14' },
    ]
  },
  {
    id: 15,
    title: 'Raya and the Last Dragon',
    posterUrl: 'https://i.ibb.co/Cbf0D4h/good-dino-4.jpg',
    rating: 8.2,
    year: 2024,
    part: 2,
    genres: ['Animation', 'Family', 'Fantasy'],
    description: 'Raya and Sisu embark on a new adventure to restore balance to the lands beyond Kumandra, facing a new mystical threat.',
    trailerUrl: 'https://www.youtube.com/embed/1VIZ89FEjYI',
    cast: [
        { name: 'Kelly Marie Tran', avatarUrl: 'https://i.pravatar.cc/150?u=12' },
        { name: 'Awkwafina', avatarUrl: 'https://i.pravatar.cc/150?u=13' },
        { name: 'Gemma Chan', avatarUrl: 'https://i.pravatar.cc/150?u=14' },
    ]
  },
];


export const mockComments: Comment[] = [
  {
    id: 1,
    user: 'Alex D.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    timestamp: '2 days ago',
    text: 'This movie was absolutely incredible! The animation was top-notch and the story was so heartwarming. A must-watch for everyone.',
  },
  {
    id: 2,
    user: 'Maria S.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    timestamp: '5 days ago',
    text: 'I laughed, I cried, and I was on the edge of my seat. The voice acting was brilliant. Can\'t wait to watch it again!',
  },
  {
    id: 3,
    user: 'Chris P.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    timestamp: '1 week ago',
    text: 'A decent film, but I felt the pacing was a bit slow in the middle. The ending made up for it though. Solid 7/10.',
  },
];