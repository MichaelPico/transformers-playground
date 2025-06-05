import { Box, Typography, Paper, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {t('dashboard.welcome')}
          </Typography>
          <Typography variant="body1">
            {t('dashboard.description')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}