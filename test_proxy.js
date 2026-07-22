const key = "sk-or-vv-d62325f58c1fba190415fcb5154366be5db7ee63b73f841f34e3ba6e52a75b81";

async function testApi(url, name) {
  try {
    const res = await fetch(`${url}/models`, {
      headers: {
        "Authorization": `Bearer ${key}`
      }
    });
    if (res.ok) {
      console.log(`[SUCCESS] ${name} is valid!`);
    } else {
      console.log(`[FAIL] ${name} returned ${res.status}`);
    }
  } catch (e) {
    console.log(`[ERROR] ${name}: ${e.message}`);
  }
}

async function run() {
  await testApi("https://api.vsegpt.ru/v1", "VseGPT");
  await testApi("https://openrouter.ai/api/v1", "OpenRouter");
  await testApi("https://api.proxyapi.ru/openai/v1", "ProxyAPI");
}

run();
