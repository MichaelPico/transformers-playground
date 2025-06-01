import { useEffect, useState } from 'react';
import { processTextEfficient } from './utils/nerProcessor';

function App() {
  const [extractedTokens, setExtractedTokens] = useState<string>('Loading...');
  const text = `
    I'm Michael Pico, a passionate 24-year-old developer with a strong background 
    in Software Development acquired at IES Domenico Scarlatti in Spain. Currently, 
    I work as a Software Developer at Elastacloud, a London-based company, where 
    I contribute to the Knowledge Miner team using technologies like .Net, 
    React and Azure to contribute to the success of innovative projects.
  `;

  useEffect(() => {
    const processNER = async () => {
      try {
        const postProcessedChunks = await processTextEfficient(text);
        setExtractedTokens(JSON.stringify(postProcessedChunks, null, 2));
      } catch (error) {
        console.error('Error processing text:', error);
        setExtractedTokens('Error processing text');
      }
    };

    processNER();
  }, []);

  return (
    <>
      <div>
        <h1>Michael Pico | Transformers Playground</h1>
        <h2>Extracted Tokens:</h2>
        <pre>{extractedTokens}</pre>
      </div>
    </>
  );
}

export default App;
