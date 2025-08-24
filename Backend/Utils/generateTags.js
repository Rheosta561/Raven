function generateTagsFromTitle(title) {
  const stopwords = new Set([
    'the', 'for', 'and', 'of', 'a', 'an', 'in', 'on', 'to', 'during', 'with', 'by', 'at', 'is', 'as', 'from', 'this', 'that', 'it', 'its', '-', '’'
  ]);

  const cleanTitle = title
    .replace(/[-–—"“”‘’']/g, '')       
    .replace(/[^a-zA-Z\s]/g, '')       
    .toLowerCase();

  const words = cleanTitle.split(/\s+/);

  const tags = [...new Set(words.filter(word =>
    word.length > 2 && !stopwords.has(word)
  ))];

  return tags.slice(0, 8); 
}

module.exports = {generateTagsFromTitle};
