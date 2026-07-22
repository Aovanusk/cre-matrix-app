const key = "sk-or-vv-d62325f58c1fba190415fcb5154366be5db7ee63b73f841f34e3ba6e52a75b81";

async function testNative() {
  const url = "https://api.vsegpt.ru/v1beta/models/gemini-2.5-flash:generateContent";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-goog-api-key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });
    console.log(`Native Gemini Endpoint: ${res.status}`);
    const text = await res.text();
    console.log(text.substring(0, 100));
  } catch (e) {
    console.error(e);
  }
}

async function testOpenAI() {
  const url = "https://api.vsegpt.ru/v1/chat/completions";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: "Hello" }]
      })
    });
    console.log(`OpenAI Endpoint: ${res.status}`);
    const text = await res.text();
    console.log(text.substring(0, 100));
  } catch (e) {
    console.error(e);
  }
}

testNative();
testOpenAI();
