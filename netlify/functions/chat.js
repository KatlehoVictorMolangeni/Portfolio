export async function handler(event) {
  try {
    if (!process.env.AI_KEY) {
      console.error("AI_KEY is not set in environment variables");
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "Server misconfigured: missing API key." })
      };
    }

    const { message } = JSON.parse(event.body);

    const context = `
You are Soso, the portfolio assistant for Katleho Victor.
Katleho Victor:
- Cum Laude ICT Application Development graduate from Sol Plaatje University
- Focus: Software Engineering and Cloud Computing
- Skills: Java, React, JavaScript, Python, MySQL, HTML/CSS, Networking, Software Testing
- Projects: hearThem, uni-coApply, MusiLife
- Experience: ICT Student Assistant helping students with programming
- Achievements: Golden Key member and multiple academic awards
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-mini",
        messages: [
          { role: "system", content: context },
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenRouter API error:", text);
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "AI API request failed." })
      };
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, something went wrong.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Sorry, something went wrong." })
    };
  }
}