import {
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from '@mui/material';
import Iconify from 'modules/components/iconify';
import React from 'react';

const ColorLibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg,${theme.palette.primary.dark} 0%,${theme.palette.primary.dark} 50%,${theme.palette.primary.light} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg,${theme.palette.primary.dark} 0%,${theme.palette.primary.dark} 50%,${theme.palette.primary.light} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorLibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean; error?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.light} 100%)`,
  }),
  ...(ownerState.active && {
    backgroundImage: `linear-gradient( 136deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 50%, ${theme.palette.secondary.light} 100%)`,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.error && {
    backgroundImage: `linear-gradient( 136deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 50%, ${theme.palette.error.light} 100%)`,
  }),
}));

const ColorLibStepIcon = (props: StepIconProps) => {
  const { active, icon, completed, error, className } = props;
  return (
    <ColorLibStepIconRoot
      ownerState={{ completed, active, error }}
      className={className}
      sx={{
        cursor: 'pointer',
      }}
    >
      {icon}
    </ColorLibStepIconRoot>
  );
};

export interface IStepperIconHorizontal {
  label: string;
  icon: string;
  description?: string;
  isCompleted?: boolean;
  caption: string;
  isError?: boolean;
  trigger?: () => Promise<boolean>;
}

interface Props {
  steps: IStepperIconHorizontal[];
  activeState: [number, React.Dispatch<React.SetStateAction<number>>];
}

const StepperIconHorizontal = ({ steps, activeState }: Props) => {
  const [activeStep, setActiveStep] = activeState;
  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<ColorLibConnector />}
    >
      {steps.map((step, index) => (
        <Step key={step.label}>
          <StepLabel
            onClick={async () => {
              if (step.isCompleted || index <= activeStep) {
                if (step.trigger) {
                  const isValidate = await step.trigger();
                  if (isValidate) {
                    setActiveStep(index);
                  }
                } else {
                  setActiveStep(index);
                }
              }
            }}
            slots={{
              stepIcon: (props: StepIconProps) => (
                <ColorLibStepIcon
                  {...props}
                  completed={step.isCompleted}
                  error={step.isError}
                  icon={<Iconify icon={step.icon} width={24} />}
                />
              ),
            }}
            optional={<Typography variant="caption">{step.caption}</Typography>}
          >
            <Typography
              variant="inherit"
              sx={{
                color: step.isError ? 'error.main' : 'inherit',
                cursor: step.isCompleted ? 'pointer' : 'default',
              }}
            >
              {step.label}
            </Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StepperIconHorizontal;
