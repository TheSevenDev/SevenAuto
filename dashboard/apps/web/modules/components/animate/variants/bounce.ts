import type { Transition, Variants } from 'framer-motion';

import { VariantsType } from '../types';
import { varTranEnter, varTranExit } from './transition';

// ----------------------------------------------------------------------

type BounceVariants = Record<string, Variants>;

export const varBounce = (props?: VariantsType): BounceVariants => {
  const durationIn = props?.durationIn;
  const durationOut = props?.durationOut;
  const easeIn = props?.easeIn;
  const easeOut = props?.easeOut;

  const enter = varTranEnter({ durationIn, easeIn }) as Transition;
  const exit = varTranExit({ durationOut, easeOut }) as Transition;

  return {
    // IN
    in: {
      initial: {},
      animate: {
        scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
        opacity: [0, 1, 1, 1, 1, 1],
        transition: enter,
      },
      exit: {
        scale: [0.9, 1.1, 0.3],
        opacity: [1, 1, 0],
        transition: exit,
      },
    },

    inUp: {
      initial: {},
      animate: {
        y: [720, -24, 12, -4, 0],
        scaleY: [4, 0.9, 0.95, 0.985, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: enter,
      },
      exit: {
        y: [12, -24, 720],
        scaleY: [0.985, 0.9, 3],
        opacity: [1, 1, 0],
        transition: exit,
      },
    },

    inDown: {
      initial: {},
      animate: {
        y: [-720, 24, -12, 4, 0],
        scaleY: [4, 0.9, 0.95, 0.985, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: enter,
      },
      exit: {
        y: [-12, 24, -720],
        scaleY: [0.985, 0.9, 3],
        opacity: [1, 1, 0],
        transition: exit,
      },
    },

    inLeft: {
      initial: {},
      animate: {
        x: [-720, 24, -12, 4, 0],
        scaleX: [3, 1, 0.98, 0.995, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: enter,
      },
      exit: {
        x: [0, 24, -720],
        scaleX: [1, 0.9, 2],
        opacity: [1, 1, 0],
        transition: exit,
      },
    },

    inRight: {
      initial: {},
      animate: {
        x: [720, -24, 12, -4, 0],
        scaleX: [3, 1, 0.98, 0.995, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: enter,
      },
      exit: {
        x: [0, -24, 720],
        scaleX: [1, 0.9, 2],
        opacity: [1, 1, 0],
        transition: exit,
      },
    },

    // OUT
    out: {
      initial: {},
      animate: {
        scale: [0.9, 1.1, 0.3],
        opacity: [1, 1, 0],
        transition: enter,
      },
      exit: {},
    },

    outUp: {
      initial: {},
      animate: {
        y: [-12, 24, -720],
        scaleY: [0.985, 0.9, 3],
        opacity: [1, 1, 0],
        transition: enter,
      },
      exit: {},
    },

    outDown: {
      initial: {},
      animate: {
        y: [12, -24, 720],
        scaleY: [0.985, 0.9, 3],
        opacity: [1, 1, 0],
        transition: enter,
      },
      exit: {},
    },

    outLeft: {
      initial: {},
      animate: {
        x: [0, 24, -720],
        scaleX: [1, 0.9, 2],
        opacity: [1, 1, 0],
        transition: enter,
      },
      exit: {},
    },

    outRight: {
      initial: {},
      animate: {
        x: [0, -24, 720],
        scaleX: [1, 0.9, 2],
        opacity: [1, 1, 0],
        transition: enter,
      },
      exit: {},
    },
  };
};
