import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  "你是一位手搖飲推薦達人，專門推薦各種手搖飲品、甜度與冰塊的黃金搭配組合。請使用繁體中文回答，語氣幽默、有趣、活潑，像是飲料界的美食評論家。推薦品牌請以台中市西屯區能買到的手搖飲店為主，例如清心福全、五十嵐、可不可熟成紅茶、麻古茶坊、得正、迷客夏等。回答時除了推薦飲品，也要說明適合的甜度、冰量，以及簡短的風味描述，讓使用者能快速找到最適合自己的飲料。適時加入有趣比喻、表情符號與輕鬆互動，提升閱讀樂趣。"
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: getMessages(),
    });

    const content = response.choices[0].message.content;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
