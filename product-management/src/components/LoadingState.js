import React from 'react';
import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography } from '@mui/material';

// PUBLIC_INTERFACE
/**
 * LoadingState component displays a loading progress bar with an optional message
 * Uses Material-UI LinearProgress for optimal accessibility
 * @see https://mui.com/material-ui/react-progress/
 * 
 * @param {Object} props - Component props
 * @param {string} [props.message='Loading...'] - Message to display below the progress bar
 * @param {string} [props.size='medium'] - Size of the progress bar ('small', 'medium', 'large')
 * @param {string} [props.testId='loading-spinner'] - Test ID for component testing
 * @param {string} [props.labelledBy] - ID of element labelling this loading state
 * @param {number} [props.progress=0] - Progress value (0-100). If not provided, shows indeterminate progress
 * @returns {JSX.Element} Loading state component
 */
const LoadingState = ({ 
  message = 'Loading...', 
  size = 'medium',
  testId = 'loading-spinner',
  labelledBy,
  progress
}) => {
  const sizes = {
    small: { width: '200px', height: 2 },
    medium: { width: '300px', height: 4 },
    large: { width: '400px', height: 6 }
  };

  const { width, height } = sizes[size] || sizes.medium;
  const isIndeterminate = progress === undefined || progress === null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        minHeight: '200px',
        gap: 2
      }}
      data-testid={testId}
    >
      <Box sx={{ width }}>
        <LinearProgress
          variant={isIndeterminate ? 'indeterminate' : 'determinate'}
          value={isIndeterminate ? undefined : progress}
          sx={{ height }}
          aria-label={message}
          aria-labelledby={labelledBy}
          data-testid={`${testId}-progress`}
        />
      </Box>
      <Typography 
        variant="body1" 
        color="text.secondary"
        data-testid={`${testId}-message`}
      >
        {message}
      </Typography>
    </Box>
  );
};

LoadingState.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  testId: PropTypes.string,
  labelledBy: PropTypes.string,
  progress: PropTypes.number
};

LoadingState.defaultProps = {
  message: 'Loading...',
  size: 'medium',
  testId: 'loading-spinner'
};

export default LoadingState;
