import { useState, useEffect } from 'react';
import { compareSentences } from '../utils/sentenceSimilarityProcessor';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SimilarityResult {
  sentence: string;
  score: number;
}

export default function SentenceSimilarityPage() {
  const { t, i18n } = useTranslation();

  const [sourceSentence, setSourceSentence] = useState<string>(t('similarity.defaultSourceSentence'));
  const [targetSentences, setTargetSentences] = useState<string>(t('similarity.defaultTargetSentences'));
  const [results, setResults] = useState<SimilarityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLanguageChange = () => {
      setSourceSentence(t('similarity.defaultSourceSentence'));
      setTargetSentences(t('similarity.defaultTargetSentences'));
      setResults([]);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, t]);

  const handleCompare = async () => {
    setIsLoading(true);
    try {
      const targetArray = targetSentences.split('\n').filter(s => s.trim());
      const similarityResults = await compareSentences(sourceSentence, targetArray);
      setResults(similarityResults);
    } catch (error) {
      console.error('Error comparing sentences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            {t('similarity.pageDescription')}
            <br/>
            <br/>
        </Typography>
          
          <TextField
            fullWidth
            label={t('similarity.sourceSentenceLabel')}
            value={sourceSentence}
            onChange={(e) => setSourceSentence(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            multiline
            rows={20}
            label={t('similarity.targetSentencesLabel')}
            value={targetSentences}
            onChange={(e) => setTargetSentences(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <Button 
            variant="contained" 
            onClick={handleCompare}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : t('similarity.compareButton')}
          </Button>
        </Paper>

        {results.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('similarity.resultsTitle')}
            </Typography>
            <List>
              {results.map((result, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${t('similarity.resultScore')}: ${result.score.toFixed(4)}`}
                      secondary={result.sentence}
                    />
                  </ListItem>
                  {index < results.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Container>
  );
}