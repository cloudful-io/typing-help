import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Typography, Paper, TextField } from "@mui/material";
import Keyboard from "./Keyboard";
import AccuracyCard from '@/app/(DashboardLayout)/components/shared/AccuracyCard';
import WPMCard from '@/app/(DashboardLayout)/components/shared/WPMCard';
import TimerControlCard from '@/app/(DashboardLayout)/components/shared/TimerControlCard';

const sampleTexts = [
  "The sun rose slowly over the quiet village, casting a golden light on the cobblestone streets. Birds chirped in the trees, and the scent of fresh bread wafted from the bakery. Children ran across the square, laughing, while merchants prepared their stalls for the busy day ahead. Every corner seemed to hold a small surprise, from a colorful flower in a window to a cat napping in the sun. Life moved gently here, as if time itself had decided to take a pause and enjoy the morning.",
  "早晨，太陽慢慢升起，把溫暖的光照在村子裡。小鳥在樹上唱歌，風輕輕吹動葉子，讓它們像小手在揮舞。孩子們在院子裡跑來跑去，笑聲響亮又開心。街道上，商店的老闆開始擺放水果和蔬菜，還有五顏六色的衣服。小貓在角落裡打盹，花兒在石縫中悄悄地長大，噴泉的水輕輕流動，發出清脆的聲音。人們互相打招呼，有的提著籃子去市場，有的帶著小狗散步。整個村子充滿了生氣，雖然是平常的一天，但大家都覺得很快樂，很舒服，仿佛時間也慢了下來，讓每個人都能享受這美好的早晨。",
  "清晨，村子裡到處充滿了活動和歡笑。人們提著籃子走在街上，裡面裝著新鮮的水果和蔬菜。孩子們在路邊跑來跑去，笑聲清脆響亮，鞋子踩在石板路上發出輕快的聲音。小鳥在樹上唱歌，微風輕輕吹過，讓葉子閃閃發光。麵包店的老闆打開店門，空氣裡充滿了麵包和糕點的香味。角落裡，小貓伸懶腰，狗狗在旁邊輕輕叫。大家互相打招呼，分享笑容和小故事，雖然只是平常的一天，但整個村子充滿了活力和快樂，每個人都覺得早晨特別美好。",
  "As the gentle breeze moved through the village, it carried the distant sound of a bell ringing softly from the tower, mingled with the chatter of early risers greeting one another, the rhythmic clatter of wooden carts moving along the cobblestones, and the faint rustle of leaves in the trees, while across the market square, merchants arranged their wares meticulously, hoping for good customers, children darted in between stalls, laughing as they played, and the overall sense of calm and purpose created a perfect morning scene, where time seemed to slow, letting everyone enjoy the beauty of a day that was ordinary, yet full of small, remarkable moments that made the village feel alive and warm.",
  "The morning in the small town was full of life and quiet excitement at the same time. People walked along the streets carrying baskets of fresh fruit and vegetables, while children ran past them laughing loudly, their shoes tapping against the cobblestones. Birds sang from the trees, and the gentle breeze made the leaves shimmer in the sunlight. Bakers opened their shops, filling the air with the sweet smell of bread and pastries. A cat stretched lazily on the windowsill, and a dog barked softly nearby. Everywhere you looked, people greeted each other warmly, sharing smiles and stories, and even though it was just another ordinary day, the town felt alive with energy and happiness, a perfect place for anyone to enjoy the morning."
];

const TypingPractice: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [targetText, setTargetText] = useState(sampleTexts[0]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [shiftActive, setShiftActive] = useState(false);

  const [timer, setTimer] = useState(60);       // countdown
  const [duration, setDuration] = useState(60); // selected session duration
  const [running, setRunning] = useState(false);

  const [wpm, setWPM] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalChars, setTotalChars] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textboxRef = useRef<HTMLInputElement>(null);

  // Start a new sentence
  const newSentence = () => {
    const randIndex = Math.floor(Math.random() * sampleTexts.length);
    setTargetText(sampleTexts[randIndex]);
    setTypedText("");
    setTimer(duration);
    setRunning(false);
    setWPM(null);
    setAccuracy(null);
    setActiveKey(null);
    setShiftActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTyping = (key: string) => {
    if (!running) return; // Only allow typing during session
    if (key === "Backspace") setTypedText((prev) => prev.slice(0, -1));
    else if (key === "Enter") setTypedText((prev) => prev + "\n");
    else if (key === "Space" || key === " ") setTypedText((prev) => prev + " ");
    else if (!["Shift", "Ctrl", "Meta", "Alt", "Caps", "Tab", "Menu"].includes(key)) {
      setTypedText((prev) => prev + key);
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!running) return;
    setTypedText(e.target.value);
  };

  const handlePaste = (event: any) => {
    event.preventDefault(); // Prevent pasting
  };

  // Physical key highlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let pressedKey = e.key;
      switch (pressedKey) {
        case " ": pressedKey = "Space"; break;
        case "CapsLock": pressedKey = "Caps"; break;
        case "Shift": pressedKey = "Shift"; setShiftActive(true); break;
        case "Enter": pressedKey = "Enter"; break;
        case "Tab": pressedKey = "Tab"; break;
        case "Backspace": pressedKey = "Backspace"; break;
      }
      let normalizedPressedKey = pressedKey;
      if (pressedKey.length === 1) normalizedPressedKey = pressedKey.toUpperCase();
      setActiveKey(normalizedPressedKey);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftActive(false);
      setActiveKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!running) return;
    if (timer <= 0) {
      setRunning(false);
      computeResults();
      return;
    }

    timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [running, timer]);

  // Start session with chosen duration
  const startSession = (selectedDuration: number) => {
    if (!running) {
      textboxRef.current?.focus();
      setTypedText("");
      setDuration(selectedDuration);
      setTimer(selectedDuration);
      setRunning(true);
      setWPM(null);
      setAccuracy(null);
    }
  };

  const computeResults = () => {
    const correct = typedText
      .split("")
      .reduce((acc, char, idx) => (char === targetText[idx] ? acc + 1 : acc), 0);

    const total = typedText.length;

    const elapsedMinutes = duration / 60;
    const calculatedWPM = Math.round((typedText.length / 5) / elapsedMinutes);
    const calculatedAccuracy = total > 0
      ? Math.round((correct / total) * 100)
      : 0;

    setWPM(calculatedWPM);
    setAccuracy(calculatedAccuracy);
    setCorrectChars(correct);
    setTotalChars(total);
  };

  const renderPracticeText = () => {
    return targetText.split("").map((char, idx) => {
      const typedChar = typedText[idx];
      let color: string = "black";
      if (typedChar != null) color = typedChar === char ? "green" : "red";
      const isNextChar = idx === typedText.length;
      return (
        <span
          key={idx}
          style={{
            color,
            textDecoration: isNextChar ? "underline" : "none",
            fontWeight: isNextChar ? "bold" : "normal",
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>

      {/* Top row: Accuracy, WPM, Timer/Controls */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{xs:12, md:4}} sx={{ display: "flex" }}>
          <AccuracyCard accuracy={accuracy} correct={correctChars} total={totalChars} />
        </Grid>
        <Grid size={{xs:12, md:4}} sx={{ display: "flex" }}>
          <WPMCard wpm={wpm} />
        </Grid>
        <Grid size={{xs:12, md:4}} sx={{ display: "flex" }}>
          <TimerControlCard
            timer={timer}
            running={running}
            onStart={startSession}       // now takes duration
            onNewSentence={newSentence}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Paper sx={{ p: 2, minHeight: "100px" }}>
          <Typography component="div" sx={{ fontSize: "1.1rem", wordWrap: "break-word" }}>
            {renderPracticeText()}
          </Typography>
        </Paper>

        <TextField
          inputRef={textboxRef}
          value={typedText}
          onChange={handleTextFieldChange}
          onPaste={handlePaste}
          multiline
          fullWidth
          minRows={3}
          variant="outlined"
          placeholder="Start typing here..."
          sx={{ fontSize: "1.1rem" }}
        />

        <Keyboard onKeyPress={handleTyping} activeKey={activeKey} shiftActive={shiftActive} />
      </Box>
    </Box>
  );
};

export default TypingPractice;
