import { useState } from 'react';
import { classifyText } from '../utils/zeroShotClassificationProcessor';
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

interface ClassificationResult {
  label: string;
  score: number;
}

export default function ZeroShotClassificationPage() {
  const [text, setText] = useState<string>("Unable to access premium features after payment!");
  const [labels, setLabels] = useState<string>("Billing\nFeature Access\nAccount Issue\nPremium Plan\nService Outage\nIntegration Support\nAPI Errors\nLogin Problems\nData Export\nSubscription Upgrade\nUser Permissions\nUI/UX Feedback");
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClassify = async () => {
    setIsLoading(true);
    try {
      const labelsArray = labels.split('\n').filter(l => l.trim());
      const classificationResults = await classifyText(text, labelsArray);
      setResults(classificationResults);
    } catch (error) {
      console.error('Error classifying text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Zero-Shot Text Classification
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Text to Classify"
            value={text}
            onChange={(e) => setText(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            multiline
            rows={5}
            label="Classification Labels (one per line)"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <Button 
            variant="contained" 
            onClick={handleClassify}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Classify Text'}
          </Button>
        </Paper>

        {results.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Classification Results
            </Typography>
            <List>
              {results.map((result, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${result.label} (Score: ${result.score.toFixed(4)})`}
                      secondary={`Confidence: ${(result.score * 100).toFixed(2)}%`}
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