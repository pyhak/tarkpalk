import OpenAI from "openai";

export async function generateSummary(inputData: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `Siin on palgaandmed valdkonna kohta:\n${inputData}\n
Koosta lihtsas eesti keeles kokkuvõte, mis selgitab:\n
- kas palk tõuseb/langeb ja miks\n
- prognoosi 2–3 aastaks\n
- soovitused, kuidas tõsta palka antud valdkonnas.`;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-4o",
    temperature: 0.7,
  });

  const raw = completion.choices[0].message.content || "";

  const html = raw
    .replace(/\*\*(.+?)\*\*:?/g, "<strong>$1</strong>")
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("\n");

  return html;

}
