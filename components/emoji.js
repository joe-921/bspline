// emoji.js
export const countryToFlagEmoji = (country) => {
  const codePoints = country
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

const countryCodes = {
  
    'afghanistan': 'AF',
    'aland islands': 'AX',
    'albania': 'AL',
    'algeria': 'DZ',
    'american samoa': 'AS',
    'andorra': 'AD',
    'angola': 'AO',
    'anguilla': 'AI',
    'antarctica': 'AQ',
    'antigua and barbuda': 'AG',
    'argentina': 'AR',
    'armenia': 'AM',
    'aruba': 'AW',
    'australia': 'AU',
    'austria': 'AT',
    'azerbaijan': 'AZ',
    'bahamas': 'BS',
    'bahrain': 'BH',
    'bangladesh': 'BD',
    'barbados': 'BB'
  // Add more country codes here
};

const emojis = {
  'fuck': '🖕',
  'love': '❤️',
  'kiss': '😘',
  'cry': '😭',
  'lol': '🤣',
  'dead': '💀',
  // Add more words and emojis here
};

export const textToFlagEmoji = (text) => {
  return text.split(' ').map(word => {
    const countryCode = countryCodes[word.toLowerCase()];
    if (countryCode) {
      return countryToFlagEmoji(countryCode);
    }
    const emoji = emojis[word.toLowerCase()];
    if (emoji) {
      return emoji;
    }
    return word;
  }).join(' ');
};
