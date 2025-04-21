import { Card as MuiCard, Stack, styled } from '@mui/material';

export const Card = styled(MuiCard)(({ theme }) => ({
  flex: '1 1 500px',
  padding: theme.spacing(4),
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minWidth: 500,
}));

export const LayoutContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: '100dvh',
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles?.('dark', {
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));

export const ResponsiveStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  justifyContent: 'center',
  width: '100%',
  maxWidth: '1200px',
}));
