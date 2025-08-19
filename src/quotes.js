/**
 * Quote Database - Tech, Innovation, and Philosophy Quotes
 * 4.5M-S Automated Quote Committer System
 */

const quotes = [
  {
    text: "Technology is best when it brings people together.",
    author: "Matt Mullenweg",
    category: "technology"
  },
  {
    text: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.",
    author: "Bill Gates",
    category: "technology"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "innovation"
  },
  {
    text: "The real problem is not whether machines think but whether men do.",
    author: "B.F. Skinner",
    category: "philosophy"
  },
  {
    text: "Technology is nothing. What's important is that you have a faith in people, that they're basically good and smart, and if you give them tools, they'll do wonderful things with them.",
    author: "Steve Jobs",
    category: "technology"
  },
  {
    text: "The most important thing in communication is hearing what isn't said.",
    author: "Peter Drucker",
    category: "philosophy"
  },
  {
    text: "It has become appallingly obvious that our technology has exceeded our humanity.",
    author: "Albert Einstein",
    category: "technology"
  },
  {
    text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
    author: "Alan Watts",
    category: "philosophy"
  },
  {
    text: "Innovation is the specific instrument of entrepreneurship. The act that endows resources with a new capacity to create wealth.",
    author: "Peter Drucker",
    category: "innovation"
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    category: "innovation"
  },
  {
    text: "Technology is a word that describes something that doesn't work yet.",
    author: "Douglas Adams",
    category: "technology"
  },
  {
    text: "Any sufficiently advanced technology is indistinguishable from magic.",
    author: "Arthur C. Clarke",
    category: "technology"
  },
  {
    text: "The science of today is the technology of tomorrow.",
    author: "Edward Teller",
    category: "innovation"
  },
  {
    text: "We are stuck with technology when what we really want is just stuff that works.",
    author: "Douglas Adams",
    category: "technology"
  },
  {
    text: "The human spirit must prevail over technology.",
    author: "Albert Einstein",
    category: "philosophy"
  },
  {
    text: "All of our technology is completely unnecessary to a happy life.",
    author: "Tom Hodgkinson",
    category: "philosophy"
  },
  {
    text: "The art challenges the technology, and the technology inspires the art.",
    author: "John Lasseter",
    category: "innovation"
  },
  {
    text: "Just because something doesn't do what you planned it to do doesn't mean it's useless.",
    author: "Thomas Edison",
    category: "innovation"
  },
  {
    text: "The telephone has too many shortcomings to be seriously considered as a means of communication.",
    author: "Western Union memo (1876)",
    category: "technology"
  },
  {
    text: "I think that's the single best piece of advice: constantly think about how you could be doing things better and questioning yourself.",
    author: "Elon Musk",
    category: "innovation"
  },
  {
    text: "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.",
    author: "Stephen Hawking",
    category: "philosophy"
  },
  {
    text: "Computing is not about computers any more. It is about living.",
    author: "Nicholas Negroponte",
    category: "technology"
  },
  {
    text: "The Internet is becoming the town square for the global village of tomorrow.",
    author: "Bill Gates",
    category: "technology"
  },
  {
    text: "Your most unhappy customers are your greatest source of learning.",
    author: "Bill Gates",
    category: "innovation"
  },
  {
    text: "The empires of the future are the empires of the mind.",
    author: "Winston Churchill",
    category: "philosophy"
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    category: "philosophy"
  },
  {
    text: "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.",
    author: "Charles Darwin",
    category: "philosophy"
  },
  {
    text: "The future belongs to organizations that can turn today's information into tomorrow's insight.",
    author: "Morris Chang",
    category: "innovation"
  },
  {
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    category: "technology"
  },
  {
    text: "The best minds are not in government. If any were, business would steal them away.",
    author: "Ronald Reagan",
    category: "philosophy"
  }
];

/**
 * Get a random quote from the database
 * @returns {Object} Random quote object with text, author, and category
 */
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

/**
 * Get quotes by category
 * @param {string} category - Category to filter by
 * @returns {Array} Array of quotes in the specified category
 */
function getQuotesByCategory(category) {
  return quotes.filter(quote => quote.category === category);
}

/**
 * Get all categories
 * @returns {Array} Array of unique categories
 */
function getCategories() {
  return [...new Set(quotes.map(quote => quote.category))];
}

/**
 * Get total number of quotes
 * @returns {number} Total count of quotes
 */
function getQuoteCount() {
  return quotes.length;
}

/**
 * Format quote for display/commit
 * @param {Object} quote - Quote object
 * @returns {string} Formatted quote string
 */
function formatQuote(quote) {
  return `${quote.text}\n- ${quote.author}`;
}

module.exports = {
  quotes,
  getRandomQuote,
  getQuotesByCategory,
  getCategories,
  getQuoteCount,
  formatQuote
};