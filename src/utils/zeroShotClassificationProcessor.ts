import { env, pipeline, type ZeroShotClassificationOutput } from '@xenova/transformers';

interface ClassificationResult {
    label: string;
    score: number;
}

/**
 * Perform zero-shot classification on a text using provided labels.
 * @param {string} text - The text to classify.
 * @param {string[]} labels - Array of possible classification labels.
 * @returns {Promise<ClassificationResult[]>}
 */
export async function classifyText(text: string, labels: string[]): Promise<ClassificationResult[]> {
    env.allowLocalModels = false;
    
    // Initialize the zero-shot classification pipeline
    const classifier = await pipeline('zero-shot-classification', 'Xenova/nli-deberta-v3-xsmall');
    console.log('Starting zero-shot classification process...');

    // Perform classification
    const output: ZeroShotClassificationOutput = (await classifier(text, labels, { multi_label: true }) as ZeroShotClassificationOutput);

    // Transform the output into our desired format
    const results: ClassificationResult[] = output.labels.map((label: string, index: number) => ({
        label,
        score: output.scores[index]
    }));

    // Sort results by score in descending order
    return results.sort((a, b) => b.score - a.score);
} 