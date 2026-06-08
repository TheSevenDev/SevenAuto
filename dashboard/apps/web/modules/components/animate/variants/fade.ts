import type { Transition, Variants } from 'framer-motion';

import { VariantsType } from '../types';
import { varTranEnter, varTranExit } from './transition';

// ----------------------------------------------------------------------

type FadeVariants = Record<string, Variants>;

export const varFade = (props?: VariantsType): FadeVariants => {
  const distance = props?.distance ?? 120;
  const durationIn = props?.durationIn;
  const durationOut = props?.durationOut;
  const easeIn = props?.easeIn;
  const easeOut = props?.easeOut;

  const enter = varTranEnter({ durationIn, easeIn }) as Transition;
  const exit = varTranExit({ durationOut, easeOut }) as Transition;

  return {
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: enter },
      exit: { opacity: 0, transition: exit },
    },

    inUp: {
      initial: { y: distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: enter },
      exit: { y: distance, opacity: 0, transition: exit },
    },

    inDown: {
      initial: { y: -distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: enter },
      exit: { y: -distance, opacity: 0, transition: exit },
    },

    inLeft: {
      initial: { x: -distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: enter },
      exit: { x: -distance, opacity: 0, transition: exit },
    },

    inRight: {
      initial: { x: distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: enter },
      exit: { x: distance, opacity: 0, transition: exit },
    },

    out: {
      initial: { opacity: 1 },
      animate: { opacity: 0, transition: enter },
      exit: { opacity: 1, transition: exit },
    },

    outUp: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -distance, opacity: 0, transition: enter },
      exit: { y: 0, opacity: 1, transition: exit },
    },

    outDown: {
      initial: { y: 0, opacity: 1 },
      animate: { y: distance, opacity: 0, transition: enter },
      exit: { y: 0, opacity: 1, transition: exit },
    },

    outLeft: {
      initial: { x: 0, opacity: 1 },
      animate: { x: -distance, opacity: 0, transition: enter },
      exit: { x: 0, opacity: 1, transition: exit },
    },

    outRight: {
      initial: { x: 0, opacity: 1 },
      animate: { x: distance, opacity: 0, transition: enter },
      exit: { x: 0, opacity: 1, transition: exit },
    },
  };
};
