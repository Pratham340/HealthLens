import dotenv from 'dotenv';
import express from 'express';
import OpenAI from 'openai';

const app = express();
const port = Number(process.env.PORT || 3000);
const string = { type: 'string' };
dotenv.config();

const dossierSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['claim', 'subject', 'action', 'outcome', 'evidence', 'strength', 'strengthText', 'pill', 'reasons', 'gaps', 'sourceNote', 'sources', 'next'],
  properties: {
    claim: string,
    subject: string,
    action: string,
    outcome: string,
    evidence: string,
    strength: { type: 'string', enum: ['Insufficient', 'Limited & mixed', 'Some support, important limits', 'Stronger evidence, still contextual'] },
    strengthText: string,
    pill: { type: 'string', enum: ['Research needed', 'Caution', 'Context matters'] },
    reasons: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'object', additionalProperties: false, required: ['title', 'detail'], properties: { title: string, detail: string } } },
    gaps: { type: 'array', minItems: 2, maxItems: 4, items: string },
    sourceNote: string,
    sources: { type: 'array', minItems: 1, maxItems: 5, items: { type: 'object', additionalProperties: false, required: ['title', 'type', 'note', 'url'], properties: { title: string, type: { type: 'string', enum: ['Primary study', 'Systematic review', 'Guideline / public-health source'] }, note: string, url: string } } },
    next: { type: 'array', minItems: 2, maxItems: 3, items: string }
  }
};

const instructions = `You are Claimlight, an educational health-claim research assistant. A user submits one health claim. Use web search before writing the dossier and return only the required JSON object.

Critical safety rules:
- Do not diagnose, assess an individual's disease, make a personal safety decision, recommend treatment or a medication/supplement dose, or say to start, stop, delay, or change care.
- Do not claim a cure, prevention, guaranteed effect, clinical validation, or certainty. Do not make emergency decisions.
- Be clear that research evidence is not individualized medical advice. Phrase findings as what study designs and sources do or do not establish.
- Parse the claim into subject, action, and outcome. If an outcome is vague, say that clearly.
- Search for direct, reputable sources. Prefer peer-reviewed primary human research. When useful, include a systematic review or public-health guidance and label it accurately.
- Do not invent citations. Include only HTTPS source URLs you found through web search. If sources are weak or do not test the exact claim, say so and use the 'Insufficient' strength.
- Give 2–4 specific, study-design reasons for the strength label and 2–4 concrete gaps. Sources must support the evidence text; source notes must explain scope, not prescribe action.
- Next steps must be neutral questions to discuss with a qualified professional if the claim matters to a health decision. Never offer treatment instructions.
- Keep every field concise, plain language, and appropriate for a general adult audience.`;

app.use(express.json({ limit: '8kb' }));
app.use(express.static('.'));

function normalizedUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    return url.href.replace(/\/$/, '');
  } catch {
    return '';
  }
}

function searchedSourceUrls(response) {
  return new Set(response.output.flatMap(item => item.type === 'web_search_call' ? (item.action?.sources || []) : []).map(source => normalizedUrl(source.url)).filter(Boolean));
}

function getClient() {
  dotenv.config({ override: true, quiet: true });
  return process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
}

app.post('/api/investigate', async (req, res) => {
  const claim = typeof req.body?.claim === 'string' ? req.body.claim.trim() : '';
  if (!claim || claim.length > 280) return res.status(400).json({ error: 'Enter a health claim of up to 280 characters.' });
  const client = getClient();
  if (!client) return res.status(500).json({ error: 'The server is missing OPENAI_API_KEY. Add it to the local .env file, then try again.' });

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.4',
      store: false,
      tools: [{ type: 'web_search' }],
      include: ['web_search_call.action.sources'],
      instructions,
      input: `Investigate this health claim: ${claim}`,
      max_output_tokens: 2200,
      text: { format: { type: 'json_schema', name: 'health_claim_dossier', strict: true, schema: dossierSchema } }
    });
    const dossier = JSON.parse(response.output_text);
    const sourceUrls = searchedSourceUrls(response);
    dossier.sources = dossier.sources.filter(source => sourceUrls.has(normalizedUrl(source.url)));
    if (!dossier.sources.length) throw new Error('No returned sources could be verified against the web search.');
    res.json(dossier);
  } catch (error) {
    console.error('Claimlight investigation failed:', error);
    res.status(502).json({ error: 'The research service could not complete this claim. Please try again.' });
  }
});

app.listen(port, () => console.log(`Claimlight is running at http://localhost:${port}`));
