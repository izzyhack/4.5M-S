/**
 * Technology and Innovation Quotes Database
 * 
 * A comprehensive collection of quotes about technology, innovation,
 * programming, and digital transformation from notable figures.
 */

class QuotesDatabase {
  constructor() {
    this.quotes = [
      // Technology Pioneers
      {
        text: "Technology is best when it brings people together.",
        author: "Matt Mullenweg",
        category: "technology"
      },
      {
        text: "The real problem is not whether machines think but whether men do.",
        author: "B.F. Skinner",
        category: "artificial-intelligence"
      },
      {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        category: "innovation"
      },
      {
        text: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.",
        author: "Bill Gates",
        category: "technology"
      },
      {
        text: "Any sufficiently advanced technology is indistinguishable from magic.",
        author: "Arthur C. Clarke",
        category: "technology"
      },
      {
        text: "The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.",
        author: "Tim Berners-Lee",
        category: "web-technology"
      },
      {
        text: "Software is eating the world.",
        author: "Marc Andreessen",
        category: "software"
      },
      {
        text: "Code is poetry.",
        author: "WordPress",
        category: "programming"
      },
      {
        text: "The best way to predict the future is to invent it.",
        author: "Alan Kay",
        category: "innovation"
      },
      {
        text: "Programming isn't about what you know; it's about what you can figure out.",
        author: "Chris Pine",
        category: "programming"
      },
      
      // Modern Tech Leaders
      {
        text: "Move fast and break things.",
        author: "Mark Zuckerberg",
        category: "development"
      },
      {
        text: "I think it's very important to have a feedback loop, where you're constantly thinking about what you've done and how you could be doing it better.",
        author: "Elon Musk",
        category: "innovation"
      },
      {
        text: "The Internet is becoming the town square for the global village of tomorrow.",
        author: "Bill Gates",
        category: "internet"
      },
      {
        text: "Your most unhappy customers are your greatest source of learning.",
        author: "Bill Gates",
        category: "business-technology"
      },
      {
        text: "Technology is nothing. What's important is that you have a faith in people, that they're basically good and smart, and if you give them tools, they'll do wonderful things with them.",
        author: "Steve Jobs",
        category: "technology"
      },
      
      // Programming Wisdom
      {
        text: "Talk is cheap. Show me the code.",
        author: "Linus Torvalds",
        category: "programming"
      },
      {
        text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        author: "Martin Fowler",
        category: "programming"
      },
      {
        text: "First, solve the problem. Then, write the code.",
        author: "John Johnson",
        category: "programming"
      },
      {
        text: "The only way to learn a new programming language is by writing programs in it.",
        author: "Dennis Ritchie",
        category: "programming"
      },
      {
        text: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci",
        category: "design"
      },
      
      // Data and AI
      {
        text: "Data is the new oil.",
        author: "Clive Humby",
        category: "data"
      },
      {
        text: "Without data, you're just another person with an opinion.",
        author: "W. Edwards Deming",
        category: "data"
      },
      {
        text: "Machine intelligence is the last invention that humanity will ever need to make.",
        author: "Nick Bostrom",
        category: "artificial-intelligence"
      },
      {
        text: "AI is likely to be either the best or worst thing to happen to humanity.",
        author: "Stephen Hawking",
        category: "artificial-intelligence"
      },
      {
        text: "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
        author: "Edsger Dijkstra",
        category: "artificial-intelligence"
      },
      
      // Digital Transformation
      {
        text: "Digital transformation is not about technology, it's about strategy and new ways of thinking.",
        author: "Joe Weinman",
        category: "digital-transformation"
      },
      {
        text: "The digital revolution is far more significant than the invention of writing or even of printing.",
        author: "Douglas Engelbart",
        category: "digital-transformation"
      },
      {
        text: "We are not going into the information age, we are in the information age.",
        author: "Harlan Cleveland",
        category: "information-age"
      },
      {
        text: "The factory of the future will have only two employees, a man and a dog. The man will be there to feed the dog. The dog will be there to keep the man from touching the equipment.",
        author: "Warren Bennis",
        category: "automation"
      },
      {
        text: "Computers are incredibly fast, accurate, and stupid. Human beings are incredibly slow, inaccurate, and brilliant.",
        author: "Albert Einstein",
        category: "computing"
      }
    ];
    
    this.currentIndex = 0;
    this.usedIndices = new Set();
  }

  /**
   * Get the next quote in sequence
   * @returns {Object} Quote object with text, author, and category
   */
  getNextQuote() {
    // Reset if we've used all quotes
    if (this.usedIndices.size >= this.quotes.length) {
      this.usedIndices.clear();
      this.currentIndex = 0;
    }

    // Find next unused quote
    while (this.usedIndices.has(this.currentIndex)) {
      this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
    }

    const quote = this.quotes[this.currentIndex];
    this.usedIndices.add(this.currentIndex);
    this.currentIndex = (this.currentIndex + 1) % this.quotes.length;

    return quote;
  }

  /**
   * Get a random quote
   * @returns {Object} Quote object with text, author, and category
   */
  getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }

  /**
   * Get quotes by category
   * @param {string} category - The category to filter by
   * @returns {Array} Array of quotes in the specified category
   */
  getQuotesByCategory(category) {
    return this.quotes.filter(quote => quote.category === category);
  }

  /**
   * Get all available categories
   * @returns {Array} Array of unique categories
   */
  getCategories() {
    return [...new Set(this.quotes.map(quote => quote.category))];
  }

  /**
   * Get total number of quotes
   * @returns {number} Total number of quotes in the database
   */
  getTotalCount() {
    return this.quotes.length;
  }

  /**
   * Format a quote for display
   * @param {Object} quote - The quote object
   * @returns {string} Formatted quote string
   */
  formatQuote(quote) {
    return `${quote.text}\n- ${quote.author}`;
  }

  /**
   * Add a new quote to the database
   * @param {string} text - The quote text
   * @param {string} author - The quote author
   * @param {string} category - The quote category
   */
  addQuote(text, author, category = 'general') {
    this.quotes.push({ text, author, category });
  }
}

module.exports = QuotesDatabase;