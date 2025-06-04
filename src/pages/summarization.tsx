import { useState } from 'react';
import { summarizeText } from '../utils/summarizationProcessor';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Container,
  CircularProgress,
  Slider
} from '@mui/material';

export default function SummarizationPage() {
  const [text, setText] = useState<string>("The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.");
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [maxTokens, setMaxTokens] = useState<number>(100);

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const result = await summarizeText(text, maxTokens);
      setSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Text Summarization
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={10}
            label="Text to Summarize"
            value={text}
            onChange={(e) => setText(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography gutterBottom>
              Maximum Summary Length: {maxTokens} tokens
            </Typography>
            <Slider
              value={maxTokens}
              onChange={(_, value) => setMaxTokens(value as number)}
              min={20}
              max={200}
              step={20}
              marks={[
                { value: 20, label: '20' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
                { value: 150, label: '150' },
                { value: 200, label: '200' }
              ]}
            />
          </Box>

          <Button 
            variant="contained" 
            onClick={handleSummarize}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Generate Summary'}
          </Button>
        </Paper>

        {summary && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generated Summary
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {summary}
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
} 