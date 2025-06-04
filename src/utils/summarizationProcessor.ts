import { env, pipeline, type SummarizationOutput } from '@xenova/transformers';
import type { GenerationConfigType } from '@xenova/transformers/types/utils/generation';

interface SummarizationResult {
    summary: string;
}

/**
 * Generate a summary for the given text using a transformer model.
 * @param {string} text - The text to summarize.
 * @param {number} maxNewTokens - Maximum number of tokens in the generated summary.
 * @returns {Promise<SummarizationResult>}
 */
export async function summarizeText(text: string, maxNewTokens: number = 100): Promise<SummarizationResult> {
    env.allowLocalModels = false;
    
    // Initialize the summarization pipeline
    const generator = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
    console.log('Starting text summarization process...');

    // Generate summary
    const options: GenerationConfigType = {
        max_new_tokens: maxNewTokens,
        temperature: 0.2,          // More focused output
        top_p: 0.8,               // Reduce randomness
        repetition_penalty: 1.15,  // Discourage repetition
        do_sample: true,          // Enable sampling with low temp
        early_stopping: true,     // Stop when good candidates found
    };
    const output: SummarizationOutput = (await generator(text, options) as SummarizationOutput);

    // Return the summary
    return {
        summary: output[0].summary_text
    };
} 