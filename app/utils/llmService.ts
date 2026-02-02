
import { AnalyzedPost, PostCategory } from '../types';

const API_KEY = "REDACTED_API_KEY";

interface LLMAnalysisResult {
    sentimentScore: number;
    intensity: number;
    category: PostCategory;
    reasoning: string; // Optional, for debugging
}

const SYSTEM_PROMPT = `
You are an expert psychological analyst AI. Your task is to analyze user posts and extract emotional metrics.
For each post provided, you must return a JSON object with the following fields:

1.  **sentimentScore** (number): A float between -1.0 (extremely negative) and 1.0 (extremely positive). 0 is neutral.
2.  **intensity** (number): An integer between 1 (low emotional charge) and 5 (explosive/high impact).
3.  **category** (string): One of the following EXACT values: 'daily', 'rant', 'reflection', 'achievement', 'relationship', 'other'.

**Category Definitions:**
- 'daily': Routine life updates, weather, food, commute.
- 'rant': Complaints, anger, frustration, venting.
- 'reflection': Deep thoughts, questions about life, self-realization.
- 'achievement': Success, finishing tasks, pride, winning.
- 'relationship': Mentions of friends, family, partners, love, social interactions.
- 'other': Anything that strictly doesn't fit above.

**Response Format:**
You must return your analysis as a strictly valid JSON array of objects. Do not include markdown code blocks (like \`\`\`json). Just the raw JSON string.
Example:
[
  {"sentimentScore": 0.8, "intensity": 3, "category": "achievement"},
  {"sentimentScore": -0.5, "intensity": 4, "category": "rant"}
]
`;

export async function analyzePostsWithLLM(posts: string[]): Promise<AnalyzedPost[]> {
    // 1. Prepare messages
    // We limit to 50 posts to ensure we don't hit basic context limits and keep latency reasonable
    const validPosts = posts.slice(0, 50).map(p => p.trim()).filter(p => p.length > 0);

    if (validPosts.length === 0) return [];

    const userContent = JSON.stringify(validPosts.map((p, i) => ({ id: i, text: p })));
    const startTime = Date.now();

    try {
        const response = await fetch('/api/proxy/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // Or "gpt-3.5-turbo" if 4o is not available on this relay
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Analyze these posts:\n${userContent}` }
                ],
                temperature: 0.2, // Low temp for consistent formatting
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("LLM API Error:", response.status, errorText);
            throw new Error(`API call failed: ${response.status}`);
        }

        const data = await response.json();
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        let content = data.choices[0]?.message?.content?.trim();

        // Usage Logging & Cost Calculation
        if (data.usage) {
            const inputTokens = data.usage.prompt_tokens;
            const outputTokens = data.usage.completion_tokens;
            const totalTokens = data.usage.total_tokens;

            // Pricing for GPT-4o (approximate as of early 2025)
            // Input: $2.50 / 1M tokens
            // Output: $10.00 / 1M tokens
            const inputCost = (inputTokens / 1_000_000) * 2.50;
            const outputCost = (outputTokens / 1_000_000) * 10.00;
            const totalCost = inputCost + outputCost;

            console.groupCollapsed(`%c 🤖 LLM Analysis Report (${validPosts.length} posts)`, "color: #4ade80; font-weight: bold; background: #064e3b; padding: 4px; border-radius: 4px;");
            console.log(`%c Duration: %c${duration.toFixed(2)}s`, "font-weight: bold", "color: #3b82f6");
            console.log(`%c Model: %cgpt-4o`, "font-weight: bold", "color: #a855f7");

            console.group("💰 Cost Analysis");
            console.table({
                "Type": { "Tokens": inputTokens, "Cost ($)": inputCost.toFixed(6) },
                "Input": { "Tokens": inputTokens, "Cost ($)": inputCost.toFixed(6) },
                "Output": { "Tokens": outputTokens, "Cost ($)": outputCost.toFixed(6) },
                "Total": { "Tokens": totalTokens, "Cost ($)": totalCost.toFixed(6) }
            });
            console.log(`%c Total Cost: $${totalCost.toFixed(6)}`, "color: #ef4444; font-weight: bold; font-size: 12px;");
            console.groupEnd();

            console.groupCollapsed("📝 Raw Response");
            console.log(content);
            console.groupEnd();
            console.groupEnd();
        }

        // Cleanup potential markdown formatting if the model disobeys
        if (content.startsWith('```json')) {
            content = content.replace(/^```json/, '').replace(/```$/, '');
        } else if (content.startsWith('```')) {
            content = content.replace(/^```/, '').replace(/```$/, '');
        }

        let parsedResults: LLMAnalysisResult[];
        try {
            parsedResults = JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse LLM JSON:", content);
            throw new Error("Invalid JSON response from LLM");
        }

        // Map back to AnalyzedPost
        // Note: The LLM might miss an item or change order (unlikely with this prompt but possible).
        // We assume strict index matching because input array order is preserved.
        return validPosts.map((originalText, index) => {
            const result = parsedResults[index] || {
                sentimentScore: 0,
                intensity: 1,
                category: 'other'
            }; // Fallback if missing

            return {
                id: `post-llm-${index}-${Date.now()}`,
                originalText,
                sentimentScore: result.sentimentScore,
                intensity: result.intensity,
                category: result.category,
                timestampIndex: index
            };
        });

    } catch (error) {
        console.error("Analysis Failed:", error);
        throw error; // Let the caller duplicate handle fallback
    }
}
