import axios from "axios";
import { openAIAPIKey } from "../constants";

const client = axios.create({
    headers: {
        "Authorization": "Bearer " + openAIAPIKey,
        "Content-Type": "application/json"
    }
})

const chatGPTEndPoint = "https://api.openai.com/v1/chat/completions";
const dalleEndPoint = "https://api.openai.com/v1/images/generations";

export const openAIAPICall = async (prompt, messages) => {
    try {
        let isPic = prompt.toLowerCase().includes('image') || prompt.includes('sketch') || prompt.includes('art') || prompt.includes('picture') || prompt.includes('drawing');
        if (isPic) {
            return dalleAPICall(prompt, messages)
        } else {
            return chatGPTAPICall(prompt, messages);
        }
    } catch (error) {
        console.log("OpenAI API Call Error ", error);
        return Promise.resolve({ success: false, message: error.message });
    }
};

const chatGPTAPICall = async (prompt, messages) => {
    try {
        const res = await client.post(chatGPTEndPoint, {
            model: "gpt-3.5-turbo",
            messages
        });

        let answer = res.data?.choices[0]?.message?.content;
        messages.push({ role: "assistant", content: answer.trim() });
        return Promise.resolve({ success: true, data: messages });
    } catch (error) {
        console.log("ChatGPT API Call Error ", error);
        if (error.response) {
            console.log('Response Data:', error.response.data);
            console.log('Response Status:', error.response.status);
            console.log('Response Headers:', error.response.headers);
        }
        return Promise.resolve({ success: false, message: error.message });
    }
};

const dalleAPICall = async (prompt, messages) => {
    try {
        const res = await client.post(dalleEndPoint, {
            prompt,
            n: 1,
            size: "512x512"
        });
        let answer = res?.data?.data[0]?.url;
        console.log(answer);
        messages.push({ role: "assistant", content: answer });
        return Promise.resolve({ success: true, data: messages });
    } catch (error) {
        console.log("Dall•E API Call Error ", error);
        if (error.response) {
            console.log('Response Data:', error.response.data);
            console.log('Response Status:', error.response.status);
            console.log('Response Headers:', error.response.headers);
        }
        return Promise.resolve({ success: false, message: error.message });
    }
};