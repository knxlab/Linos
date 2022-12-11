import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { enumKeys } from '../../../helpers/enum';
import { NftCreateStep } from './types';


export default function NftCreateStatusStepper({ step = 0 }: { step? : NftCreateStep }) {
    return (
        <Stepper activeStep={step}>
            {enumKeys(NftCreateStep).map((NftCreateStepKey, index) => {
                return (
                    <Step key={NftCreateStepKey}>
                        <StepLabel>{NftCreateStepKey}</StepLabel>
                    </Step>
                );
            })}
        </Stepper>
    )
}