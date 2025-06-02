import { useState } from 'react';
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

interface SimilarityResult {
  sentence: string;
  score: number;
}

export default function SentenceSimilarityPage() {
  const [sourceSentence, setSourceSentence] = useState<string>("Unable to deploy my application to the staging environment");
  const [targetSentences, setTargetSentences] = useState<string>("Deployment to staging environment fails with timeout error\nApp deployment stuck at initializing stage\nCannot push latest build to staging\nBuild completes but app not available in staging\nIssue deploying app to platform\nError 504 when accessing staging deployment\nDeploying to production works, but staging fails\nPermissions error when deploying app\nDeployment rollback triggered unexpectedly\nCI/CD pipeline fails during deploy step\nNew version not showing up after deployment\nStaging environment not syncing with latest code\nResource quota exceeded during deployment\nUnexpected error when deploying via CLI\nCannot deploy app due to missing environment variables\nStaging app crashes right after deployment\nApp not reachable after deploying to staging\nReceiving “deployment failed” error in dashboard\nWeb interface shows deployment as successful but app not working\nDeploy script exits with non-zero status");
  const [results, setResults] = useState<SimilarityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
          <Typography variant="h5" gutterBottom>
            Sentence Similarity Comparison
          </Typography>
          
          <TextField
            fullWidth
            label="Source Sentence"
            value={sourceSentence}
            onChange={(e) => setSourceSentence(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            multiline
            rows={20}
            label="Target Sentences (one per line)"
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
            {isLoading ? <CircularProgress size={24} /> : 'Compare Sentences'}
          </Button>
        </Paper>

        {results.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Similarity Results
            </Typography>
            <List>
              {results.map((result, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`Score: ${result.score.toFixed(4)}`}
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