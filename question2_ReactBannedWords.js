const bannedWords = ["123", "321"];

function validateText(text) {
  if (text === "") return [""];

  function sliceAndAddElem(text, arr, start, finish) {
    const element = text.slice(start, finish);
    if (element !== "") arr.push(element);
  }

  const reg = new RegExp(bannedWords.map((el) => `(${el})`).join("|"), "g");

  const arrWithBanWords = Array.from(text.matchAll(reg));

  const result = arrWithBanWords.reduce(
    (priv, el) => {
      const startBanWord = el.index;

      const finishPrivBanWord = priv.init;

      sliceAndAddElem(text, priv.res, finishPrivBanWord, startBanWord);

      priv.res.push(`<BannedWordComponent>${el[0]}</BannedWordComponent>`);

      priv.init = el[0].length + startBanWord;

      return priv;
    },
    { init: 0, res: [] }
  );

  sliceAndAddElem(text, result.res, result.init);

  return result.res;
}

module.exports = {
  validateText,
};
