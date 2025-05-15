import React from 'react';
import { Card, CardContent, Typography, Box, SxProps, Theme } from '@mui/material';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color = 'primary.main',
  sx = {},
}) => {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
