import { env, pipeline } from '@xenova/transformers';

interface SimilarityResult {
  sentence: string;
  score: number;
}

interface SentenceEmbedding {
  text: string;
  embedding: number[];
}

/**
 * Compare a source sentence to an array of target sentences using in-memory embeddings.
 * @param {string} sourceSentence - The sentence to compare from.
 * @param {string[]} targetSentences - Array of sentences to compare against.
 * @returns {Promise<SimilarityResult[]>}
 */
export async function compareSentences(sourceSentence: string, targetSentences: string[]): Promise<SimilarityResult[]> {
    env.allowLocalModels = false;
    
    // Initialize the embedding pipeline with the more efficient model
    const extractor =  await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-large-v1');
    console.log('Starting sentence comparison process...');

    // Generate embeddings for all sentences at once
    const allSentences = [sourceSentence, ...targetSentences];
    const embeddings: SentenceEmbedding[] = [];

    // Process all sentences in a single batch
    for (const text of allSentences) {
        const [embedding] = await extractor(text, { pooling: 'mean', normalize: true });
        embeddings.push({
            text,
            embedding: Array.from(embedding.data)
        });
    }

    // Get source embedding
    const sourceEmbedding = embeddings[0].embedding;

    // Calculate similarities for all target sentences
    const results = embeddings.slice(1).map(({ text, embedding }) => {
        const score = cosineSimilarity(sourceEmbedding, embedding);
        return { sentence: text, score };
    });

    // Sort results by similarity score
    return results.sort((a, b) => b.score - a.score);
}

// Cosine similarity function optimized for normalized vectors
function cosineSimilarity(vec1: number[], vec2: number[]): number {
    return vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
}
