import { useState } from 'react';
import { processTextEfficient } from '../utils/nerProcessor';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Container,
  Chip,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material';

interface Token {
  type: string;
  text: string;
}

const getTypeLabel = (type: string): string => {
  switch(type) {
    case 'PER': return 'Person';
    case 'ORG': return 'Organization';
    case 'LOC': return 'Location';
    case 'MISC': return 'Other';
    default: return type;
  }
};

export default function NerPage() {
  const [extractedTokens, setExtractedTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState<string>(`I'm Michael Pico, a passionate 24-year-old developer with a strong background in Software Development acquired at IES Domenico Scarlatti in Spain. Currently, I work as a Software Developer at Elastacloud, a London-based company, where I contribute to the Knowledge Miner team using technologies like .Net, React and Azure to contribute to the success of innovative projects.
  `);

  const processNER = async (text: string) => {
    setIsLoading(true);
    try {
      const postProcessedChunks = await processTextEfficient(text);
      setExtractedTokens(postProcessedChunks);
    } catch (error) {
      console.error('Error processing text:', error);
      setExtractedTokens([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtract = () => {
    processNER(inputText);
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'PER': return 'primary';
      case 'ORG': return 'success';
      case 'LOC': return 'warning';
      default: return 'default';
    }
  };

  const groupedTokens = extractedTokens.reduce((acc, token) => {
    if (!acc[token.type]) {
      acc[token.type] = [];
    }
    acc[token.type].push(token);
    return acc;
  }, {} as Record<string, Token[]>);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            label="Input Text"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleExtract}
              disabled={isLoading}
            >
              Extract Tokens
            </Button>
            {isLoading && <CircularProgress size={24} />}
          </Box>

          <Typography variant="h5" component="h2" gutterBottom>
            Extracted Tokens:
          </Typography>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2,
              maxHeight: '600px',
              overflow: 'auto'
            }}
          >
            {Object.entries(groupedTokens).map(([type, tokens]) => (
              <Box key={type} sx={{ mb: 2 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {getTypeLabel(type)}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {tokens.map((token, index) => (
                    <Chip
                      key={`${token.text}-${index}`}
                      label={token.text}
                      color={getTypeColor(type)}
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Stack>
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </Paper>
        </Paper>
      </Box>
    </Container>
  );
}