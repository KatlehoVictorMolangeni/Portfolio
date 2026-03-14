import fetch from "node-fetch"; // only if runtime requires

export async function handler(event) {
  try {
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

    // Call OpenRouter API
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

    // Log if API fails
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      throw new Error("AI API request failed");
    }

    const data = await response.json();
    console.log("OpenRouter API response:", data); // Log full response for debugging

    const reply = data?.choices?.[0]?.message?.content || "Sorry, something went wrong.";
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Sorry, something went wrong." })
    };
  }
}