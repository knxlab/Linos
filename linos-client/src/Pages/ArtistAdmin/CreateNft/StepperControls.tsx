import { Button } from '@mui/material';
import styles from './styles.module.css';
import { NftCreateStep } from './types';

export default function StepperControl({ step, onChangeStep } : { step: NftCreateStep; onChangeStep: (val: NftCreateStep) => any }) {
  return (
    <div className={styles.stepperControlContainer}>
      {step !== 0 ? (
        <Button onClick={() => onChangeStep(step-1)}>Prev</Button>
      ) : <div />}
      {step !== NftCreateStep.Create ? (
        <Button onClick={() => onChangeStep(step+1)}>Next</Button>
      ): <div />}
    </div>
  )
}