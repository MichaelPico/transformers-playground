import { pipeline, env, type TokenClassificationSingle } from '@xenova/transformers';

const STANDARD_MODEL = 'jdp8/wikineural-multilingual-ner';
const LONG_TEXT_MODEL = 'Xenova/bert-base-multilingual-cased-ner-hrl';

interface ProcessedChunk {
  type: string;
  text: string;
}

export async function processText(text: string): Promise<ProcessedChunk[]> {
  console.log('Starting text processing...');
  env.allowLocalModels = false;
  
  console.log('Loading NER pipeline with model:', STANDARD_MODEL);
  const classifier = await pipeline('token-classification', STANDARD_MODEL);
  console.log('NER pipeline loaded successfully');
  
  console.log('Running NER inference on text...');
  const outputs = await classifier(text, {
    ignore_labels: ['O']
  }) as TokenClassificationSingle[];
  console.log('NER inference completed. Found', outputs.length, 'tokens');

  const chunks: ProcessedChunk[] = [];
  let currentChunk: { type: string; tokens: string[] } = { type: '', tokens: [] };

  console.log('Processing tokens into chunks...');
  for (let i = 0; i < outputs.length; i++) {
    const token = outputs[i];
    const word = token.word;
    const entity = token.entity;

    if (entity.startsWith('B-')) {
      if (currentChunk.tokens.length > 0) {
        chunks.push({
          type: currentChunk.type,
          text: reconstructText(currentChunk.tokens)
        });
        currentChunk = { type: '', tokens: [] };
      }
      currentChunk.type = entity.slice(2);
      currentChunk.tokens = [word];
    } else if (entity.startsWith('I-')) {
      if (currentChunk.type === entity.slice(2)) {
        currentChunk.tokens.push(word);
      } else {
        if (currentChunk.tokens.length > 0) {
          chunks.push({
            type: currentChunk.type,
            text: reconstructText(currentChunk.tokens)
          });
        }
        currentChunk = { type: entity.slice(2), tokens: [word] };
      }
    }
  }

  if (currentChunk.tokens.length > 0) {
    chunks.push({
      type: currentChunk.type,
      text: reconstructText(currentChunk.tokens)
    });
  }

  console.log('Chunk processing completed. Found', chunks.length, 'entities');
  return chunks;
}

function reconstructText(tokens: string[]): string {
  console.log('Reconstructing text from', tokens.length, 'tokens');
  let result = '';
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (token.startsWith('##')) {
      result += token.slice(2);
    } else {
      if (i > 0) result += ' ';
      result += token;
    }
  }
  
  return result.trim();
}

export async function processTextEfficient(text: string): Promise<ProcessedChunk[]> {
  console.log('Starting efficient text processing...');
  env.allowLocalModels = false;
  
  if (text.length > 2000) {
    console.log('Text length exceeds 2000 characters, using long text processing');
    return await processLongText(text);
  }
  
  console.log('Text length within limits, using standard processing');
  return await processText(text);
}

async function processLongText(text: string): Promise<ProcessedChunk[]> {
  console.log('Loading NER pipeline for long text processing with model:', LONG_TEXT_MODEL);
  const classifier = await pipeline('token-classification', LONG_TEXT_MODEL);
  
  console.log('Splitting text into chunks...');
  const chunks = splitTextIntoChunks(text, 400);
  console.log('Text split into', chunks.length, 'chunks');
  
  const allResults: ProcessedChunk[] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
    const outputs = await classifier(chunks[i], {
      ignore_labels: ['O']
    }) as TokenClassificationSingle[];
    
    const chunkResults = processTokens(outputs);
    allResults.push(...chunkResults);
  }
  
  console.log('Merging adjacent chunks...');
  const mergedResults = mergeAdjacentChunks(allResults);
  console.log('Final results:', mergedResults.length, 'entities found');
  return mergedResults;
}

function processTokens(outputs: TokenClassificationSingle[]): ProcessedChunk[] {
  console.log('Processing', outputs.length, 'tokens into chunks');
  const chunks: ProcessedChunk[] = [];
  let currentChunk: { type: string; tokens: string[] } = { type: '', tokens: [] };

  for (const token of outputs) {
    const word = token.word;
    const entity = token.entity;

    if (entity.startsWith('B-')) {
      if (currentChunk.tokens.length > 0) {
        chunks.push({
          type: currentChunk.type,
          text: reconstructText(currentChunk.tokens)
        });
      }
      currentChunk = { type: entity.slice(2), tokens: [word] };
    } else if (entity.startsWith('I-')) {
      if (currentChunk.type === entity.slice(2)) {
        currentChunk.tokens.push(word);
      } else {
        if (currentChunk.tokens.length > 0) {
          chunks.push({
            type: currentChunk.type,
            text: reconstructText(currentChunk.tokens)
          });
        }
        currentChunk = { type: entity.slice(2), tokens: [word] };
      }
    }
  }

  if (currentChunk.tokens.length > 0) {
    chunks.push({
      type: currentChunk.type,
      text: reconstructText(currentChunk.tokens)
    });
  }

  console.log('Token processing completed. Found', chunks.length, 'entities');
  return chunks;
}

function splitTextIntoChunks(text: string, maxChars: number): string[] {
  console.log('Splitting text into chunks of max', maxChars, 'characters');
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChars && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  console.log('Text split into', chunks.length, 'chunks');
  return chunks;
}

function mergeAdjacentChunks(chunks: ProcessedChunk[]): ProcessedChunk[] {
  console.log('Starting chunk merging process...');
  if (chunks.length === 0) return chunks;
  
  const merged: ProcessedChunk[] = [];
  let current = chunks[0];
  
  for (let i = 1; i < chunks.length; i++) {
    if (chunks[i].type === current.type) {
      current.text += ' ' + chunks[i].text;
    } else {
      merged.push(current);
      current = chunks[i];
    }
  }
  
  merged.push(current);
  console.log('Chunk merging completed. Final count:', merged.length, 'entities');
  return merged;
}