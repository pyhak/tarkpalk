import React from 'react';
import { Typography, List, ListItem } from '@mui/material';

interface FormattedAiResponseProps {
  summary: string;
}

export const FormattedAiResponse: React.FC<FormattedAiResponseProps> = ({ summary }) => {
  const lines = summary.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <List key={key} sx={{ pl: 2 }}>
          {currentList.map((item, idx) => (
            <ListItem key={idx} sx={{ display: 'list-item' }}>
              <Typography variant="body1">{item}</Typography>
            </ListItem>
          ))}
        </List>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const isNumberedListItem = /^\d+\.\s+/.test(line);
    const isHeading = /^[A-ZÄÖÕÜ].*:\s*$/.test(line); // Pealkiri nt "Soovitused:"
    const isBoldedTitleLine = /^\*\*(.*?)\*\*:\s*/.test(line); // **Pealkiri**: Sisu
    const isCleanedBoldHeading = /^\*\*(.*?)\*\*:?$/.test(line); // **Pealkiri:** või **Pealkiri**

    if (isNumberedListItem) {
      currentList.push(line.replace(/^\d+\.\s+/, ''));
    } else {
      flushList(`list-${index}`);

      if (isBoldedTitleLine) {
        const [, title] = line.match(/^\*\*(.*?)\*\*:\s*/) || [];
        const content = line.replace(/^\*\*(.*?)\*\*:\s*/, '');
        elements.push(
          <Typography key={`subheading-${index}`} variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            {title}
          </Typography>
        );
        if (content) {
          elements.push(
            <Typography key={`content-${index}`} variant="body1" paragraph>
              {content}
            </Typography>
          );
        }
      } else if (isCleanedBoldHeading) {
        const [, cleanTitle] = line.match(/^\*\*(.*?)\*\*:?$/) || [];
        elements.push(
          <Typography key={`clean-heading-${index}`} variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
            {cleanTitle}
          </Typography>
        );
      } else if (isHeading) {
        elements.push(
          <Typography key={`heading-${index}`} variant="h6" sx={{ mt: 2 }}>
            {line.replace(/:\s*$/, '')}
          </Typography>
        );
      } else {
        elements.push(
          <Typography key={`p-${index}`} variant="body1" paragraph>
            {line}
          </Typography>
        );
      }
    }
  });

  flushList('final-list');

  return <div>{elements}</div>;
};
