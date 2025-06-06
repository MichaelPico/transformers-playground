import { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

interface Token {
  type: string;
  text: string;
}

export default function NerPage() {
  const { t, i18n } = useTranslation();
  const [extractedTokens, setExtractedTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState<string>(t('ner.defaultInputText'));

  useEffect(() => {
    const handleLanguageChange = () => {
      setExtractedTokens([]);
      setInputText(t('ner.defaultInputText'));
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, t]);

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
          <Typography variant="body1" gutterBottom>
            {t('ner.pageDescription')}
            <br />
            <br />
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            label={t('ner.inputTextLabel')}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleExtract}
              disabled={isLoading}
            >
              {t('ner.extractTokensButton')}
            </Button>
            {isLoading && <CircularProgress size={24} />}
          </Box>

          <Typography variant="h5" component="h2" gutterBottom>
            {t('ner.extractedTokensTitle')}
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
                  {t(`ner.tokenType.${type}`)}
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