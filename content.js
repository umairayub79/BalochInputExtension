let isShiftMode = false;
let isBalochiMode = false; // Track Balochi input mode

// Balochi character mapping
const normalMap = {
  q: "ق",
  w: "و",
  e: "ع",
  r: "ر",
  t: "ت",
  y: "ے",
  u: "ء",
  i: "ی",
  o: "ہ",
  p: "پ",
  a: "ا",
  s: "س",
  d: "د",
  f: "ف",
  g: "گ",
  h: "ھ",
  j: "ج",
  k: "ک",
  l: "ل",
  z: "ز",
  x: "ش",
  c: "چ",
  v: "ط",
  b: "ب",
  n: "ن",
  m: "م",
  Q: "ءُ",
  W: "ؤ",
  E: "ءِ",
  R: "ڑ",
  T: "ٹ",
  Y: "ۓ",
  U: "ٰ",
  I: "ئ",
  O: "ْ",
  P: "ُ",
  A: "آ",
  S: "ص",
  D: "ڈ",
  F: "ءَ",
  G: "غ",
  H: "ح",
  J: "ض",
  K: "خ",
  L: "ئِے",
  Z: "ذ",
  X: "ژ",
  C: "ث",
  V: "ظ",
  B: "یٔ",
  N: "ں",
  M: "اَنت",
  "`": "ً",
  ";": "؛",
  "'": "ۂ",
  ",": "،",
  ".": "۔",
  "/": "ْ",
};

const shiftMap = {
  ",": "ِ",
  "<": "ِ",
  ".": "َ",
  ">": "َ",
  "/": "؟",
  "?": "؟",
  ";": ":",
  ":": ":",
  "'": "‘",
  '"': "‘",
  0: "ّ",
  ")": "ّ",
};

// Convert English text to Balochi
const convertToBalochi = (text) => {
  let balochiText = "";
  for (const char of text) {
    if (isShiftMode && shiftMap[char]) {
      balochiText += shiftMap[char];
    } else if (normalMap[char]) {
      balochiText += normalMap[char];
    } else {
      balochiText += char; // Keep unchanged if no mapping
    }
  }
  return balochiText;
};

// Listen for keyboard events on any input field
document.addEventListener("keydown", (e) => {
  // Check for Ctrl + Space to toggle Balochi mode
  if (e.ctrlKey && e.keyCode === 32) {
    e.preventDefault(); // Prevent the default action (e.g., scrolling)
    isBalochiMode = !isBalochiMode; // Toggle Balochi mode
    const modeMessage = isBalochiMode
      ? "Balochi Input Mode: ON"
      : "Balochi Input Mode: OFF";
    showNotification(modeMessage); // Notify the user
  }

  // Handle Shift key for uppercase in Balochi
  if (isBalochiMode && (e.key === "Shift" || e.getModifierState("CapsLock"))) {
    isShiftMode = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (isBalochiMode && (e.key === "Shift" || e.getModifierState("CapsLock"))) {
    isShiftMode = false;
  }
});

document.addEventListener("input", (e) => {
  const target = e.target;
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
    const { value, selectionStart } = target;

    // If Balochi mode is active, convert the input
    if (isBalochiMode) {      
      target.setAttribute("dir", "rtl"); // Set direction to RTL

      const newValue = convertToBalochi(
        value.slice(selectionStart - 1, selectionStart)
      );
      if (newValue !== value.charAt(selectionStart - 1)) {
        target.value =
          value.slice(0, selectionStart - 1) +
          newValue +
          value.slice(selectionStart);
        target.setSelectionRange(selectionStart, selectionStart); // Keep cursor in the right position
      }
    } else {
      target.setAttribute("dir", "unset"); // Reset to LTR when not in Balochi mode
    }
  }
});

// Create a notification element for the input mode
const notification = document.createElement("div");
notification.style.position = "fixed";
notification.style.bottom = "20px";
notification.style.right = "10px";
notification.style.padding = "5px 10px";
notification.style.backgroundColor = "#000";
notification.style.color = "#fff";
notification.style.borderRadius = "5px";
notification.style.display = "none";
notification.style.zIndex = 9999;
document.body.appendChild(notification);

const showNotification = (message) => {
  notification.innerText = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
};
