// Juiced Click Counter
const btn = document.getElementById('btn');
const countEl = document.getElementById('count');
const timerEl = document.getElementById('timer');
const liveCpsEl = document.getElementById('liveCPS');
const resultEl = document.getElementById('result');
const finalText = document.getElementById('finalText');
const restartBtn = document.getElementById('restart');

let totalClicks = 0;
let running = false;
let startTime = null;
let endTime = null;
let runDuration = 10.0; // seconds
let timerInterval = null;

// store timestamps (ms) of clicks to compute "live cps" based on last 1s
let clickTimes = [];

// A reasonable "visual max CPS" for mapping color intensity (tweakable)
const visualMaxCps = 20; // at this CPS the button becomes fully red

// Utility: compute CPS as number of clicks in last 1000ms
function computeLiveCps() {
  const now = performance.now();
  // remove old timestamps older than 1100ms for safety
  while (clickTimes.length && (now - clickTimes[0]) > 1100) clickTimes.shift();
  return clickTimes.length;
}

// Map cps -> hue (120 = green, 0 = red). Clamped.
function colorForCps(cps) {
  const t = Math.min(cps / visualMaxCps, 1.0); // 0..1
  const hue = Math.round(120 - 120 * t); // 120->0
  return `hsl(${hue} 80% 45%)`;
}

// Update timer display
function updateTimerDisplay(remaining) {
  timerEl.textContent = remaining.toFixed(2);
}

// Start the 10s run
function startRun() {
  running = true;
  totalClicks = 0;
  startTime = performance.now();
  endTime = startTime + runDuration * 1000;
  resultEl.classList.add('hidden');

  // update timer frequently for smoothness
  timerInterval = setInterval(() => {
    const now = performance.now();
    const rem = Math.max(0, (endTime - now) / 1000);
    updateTimerDisplay(rem);
    // keep updating live cps display even if not clicked
    liveCpsEl.textContent = computeLiveCps().toFixed(2);

    if (now >= endTime) {
      finishRun();
    }
  }, 50);
}

// End the run and show result
function finishRun() {
  if (!running) return;
  running = false;
  clearInterval(timerInterval);
  timerInterval = null;

  const elapsed = (Math.min(performance.now(), endTime) - startTime) / 1000;
  const cps = elapsed > 0 ? (totalClicks / elapsed) : 0;

  // show final text and restart
  finalText.innerHTML = `<strong>${totalClicks}</strong> clicks — <strong>${cps.toFixed(2)}</strong> CPS`;
  resultEl.classList.remove('hidden');

  // freeze timer at 0.00
  updateTimerDisplay(0.00);
  liveCpsEl.textContent = '0.00';
  // set button back to neutral color
  btn.style.background = '';
}

// Reset everything to start state
function resetAll() {
  totalClicks = 0;
  clickTimes = [];
  running = false;
  startTime = null;
  endTime = null;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  countEl.textContent = '0';
  updateTimerDisplay(runDuration);
  liveCpsEl.textContent = '0.00';
  resultEl.classList.add('hidden');
  // reset button color
  btn.style.background = '';
}

// handle a click
function handleClick() {
  const now = performance.now();
  // start run on first click
  if (!running) startRun();

  totalClicks++;
  countEl.textContent = totalClicks;

  // push timestamp for live cps
  clickTimes.push(now);

  // pop animation on button
  btn.classList.remove('pop');
  // force reflow to restart animation
  // eslint-disable-next-line no-unused-expressions
  btn.offsetWidth;
  btn.classList.add('pop');

  // shake the number
  countEl.classList.remove('shake');
  // force reflow
  // eslint-disable-next-line no-unused-expressions
  countEl.offsetWidth;
  countEl.classList.add('shake');

  // update live cps and reflect color
  const liveCps = computeLiveCps();
  liveCpsEl.textContent = liveCps.toFixed(2);

  // map to color and apply as background of button
  btn.style.background = `linear-gradient(180deg, ${colorForCps(liveCps)}, ${shade(colorForCps(liveCps), -10)})`;
}

// slight helper to darken/lighten HSL color string "hsl(h s% l%)" by adjusting lightness
function shade(hslString, deltaLightness){
  // naive parse
  const match = /hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/.exec(hslString);
  if(!match) return hslString;
  const h = match[1], s = match[2], l = Math.max(0, Math.min(100, Number(match[3]) + deltaLightness));
  return `hsl(${h} ${s}% ${l}%)`;
}

btn.addEventListener('click', handleClick);
restartBtn.addEventListener('click', resetAll);

// init UI
resetAll();
