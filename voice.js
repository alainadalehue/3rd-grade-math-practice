// Picks the most natural-sounding English voice the device has.
// Phones, tablets and computers each ship different voices; the "Premium",
// "Enhanced", "Natural" and "Neural" ones sound far more human than the default.
(function () {
  let cached = null;

  // Novelty and very robotic voices to never use.
  const AVOID = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Good News|Hysterical|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy|Princess|Grandma|Grandpa|Rocko|Shelley|Sandy|Flo|Eddy|Reed/i;
  // Voices that tend to sound warm and clear.
  const NICE = /Ava|Samantha|Zoe|Allison|Susan|Evan|Nathan|Joelle|Noelle|Aria|Jenny|Michelle|Emma|Libby|Sonia|Serena|Karen|Moira|Tessa|Google US English|Google UK English Female/i;

  function score(v) {
    let s = 0;
    if (AVOID.test(v.name)) s -= 100;
    if (/Premium/i.test(v.name)) s += 60;
    if (/Enhanced|Natural|Neural/i.test(v.name)) s += 45;
    if (/Online/i.test(v.name)) s += 15;      // Microsoft Edge's natural voices
    if (/^Google/i.test(v.name)) s += 15;      // Chrome's voices beat the system default
    if (NICE.test(v.name)) s += 10;
    if (/^en[-_]US/i.test(v.lang)) s += 5;
    return s;
  }

  window.bestVoice = function () {
    if (cached) return cached;
    try {
      const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
      if (!vs.length) return null;
      cached = vs.sort((a, b) => score(b) - score(a))[0];
    } catch (e) { return null; }
    return cached;
  };

  // Voices often load a moment after the page does.
  try {
    if (window.speechSynthesis) {
      speechSynthesis.addEventListener('voiceschanged', () => { cached = null; window.bestVoice(); });
      window.bestVoice();
    }
  } catch (e) {}
})();
