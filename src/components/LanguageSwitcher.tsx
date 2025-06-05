import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useState, type FC } from 'react';
import { ThemeSwitcher } from '@toolpad/core/DashboardLayout';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

const LanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Change Language">
        <IconButton
          color="inherit"
          onClick={handleClick}
          size="large"
        >
          <TranslateIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
          >
            {language.name}
          </MenuItem>
        ))}
      </Menu>
      <ThemeSwitcher/>
    </>
  );
};

export default LanguageSwitcher; 