/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable prefer-const */
// eslint-disable indent


module.exports = {
  basicResponse,

  telegramResponse,
  telegramQuickReplies,
  telegramCard,
};

/**
 *
 * @param {*} text string
 * @return {Object} JSON object with a basic response
 * @exports True
 */
function basicResponse(text) {
  let response = {
    'fulfillmentText': text,
    'fulfillmentMessages':
      [
        {
          'platform': 'ACTIONS_ON_GOOGLE',
          'simpleResponses': {
            'simpleResponses': [
              {
                'textToSpeech': text,
              },
            ],
          },
        },
        {
          'text': {
            'text': [
              text,
            ],
          },
        },
      ],

  };

  return response;
}

// Telegram
/**
 * This function adds a Telegram response to the basic response
 * @param {Object} basicResponse JSON object with a basic response
 * @param {string} key Title for the Telegram response || Array of string for simple list
 * @param {Array} obj Array of objects with title and telegramKey properties
 * @return {void}
 * @usage Only for Telegram
 * @exports True
 */
function telegramResponse(basicResponse, key) {
  basicResponse.fulfillmentMessages.push({
    platform: 'TELEGRAM',
    text: {
      text: [
        key,
      ],
    },
  });
}

/**
 * 
 * @param {*} basicResponse JSON object with a basic response
 * @param {*} title string
 * @param {*} arg Array of strings
 */
function telegramQuickReplies(basicResponse, title, arg) {
  basicResponse.fulfillmentMessages.push({
    quickReplies: {
      title: title,
      quickReplies: arg,
    },
    platform: 'TELEGRAM',
  });
}

function telegramCard(basicResponse, title, subtitle, image, button) {
  basicResponse.fulfillmentMessages.push({
    card: {
      title: title,
      subtitle: subtitle,
      imageUri: image,
      buttons: [
        {
          text: button,
          postback: button,
        },
      ],
    },
    platform: 'TELEGRAM',
  });
}