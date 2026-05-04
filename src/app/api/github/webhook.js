require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 🔹 Helper: Call OpenAI
async function callAI(prompt) {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  return res.data.choices[0].message.content;
}

// 🔹 Generate Test Cases
async function generateTestCases(diff) {
  const prompt = `
You are a QA engineer.

Given this git diff:
${diff}

Generate:
1. Functional test cases
2. Edge cases
3. Regression scenarios

Format:
- Test Case ID
- Description
- Steps
- Expected Result
`;

  return await callAI(prompt);
}

// 🔹 Generate Release Notes
async function generateReleaseNotes(prData) {
  const prompt = `
Convert this pull request into release notes:

Title: ${prData.title}
Description: ${prData.body}

Make it:
- Simple
- Non-technical
- Bullet points
`;

  return await callAI(prompt);
}

// 🔹 Comment on PR
async function commentOnPR(repo, issueNumber, comment) {
  const url = `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`;

  await axios.post(
    url,
    { body: comment },
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    }
  );
}

// 🔹 Webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    const event = req.headers["x-github-event"];
    const payload = req.body;

    // Only handle PR events
    if (event === "pull_request") {
      const action = payload.action;
      const pr = payload.pull_request;

      const repo = payload.repository.full_name;
      const issueNumber = pr.number;

      console.log(`PR ${action}: #${issueNumber}`);

      // Only process when PR opened or updated
      if (["opened", "synchronize"].includes(action)) {
        // 🔹 Get diff
        const diff = await axios.get(pr.diff_url).then((r) => r.data);

        // 🔹 Generate AI outputs
        const testCases = await generateTestCases(diff);

        const comment = `
### 🤖 AI Generated Test Cases

${testCases}
        `;

        await commentOnPR(repo, issueNumber, comment);
      }

      // 🔹 On merge → release notes
      if (action === "closed" && pr.merged) {
        const releaseNotes = await generateReleaseNotes(pr);

        const comment = `
### 🚀 Release Notes

${releaseNotes}
        `;

        await commentOnPR(repo, issueNumber, comment);

        // 👉 You can plug WhatsApp API call here later
        console.log("Release Notes:", releaseNotes);
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error");
  }
});

// 🔹 Start server
app.listen(3000, () => {
  console.log("Webhook server running on port 3000");
});