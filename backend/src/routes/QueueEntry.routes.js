import express from "express";
import { handleNewQueueEntry, handleCallNext, handleCompleted, handleSkipped, handleShowStats, handleGetCustomerPosition,handleAnalytics } from "../controllers/QueueEntry.controller.js";
import restrictValidUserOnly from "../middlewares/auth.middleware.js";

const queueEntryRouter = express.Router();

//join the queue
queueEntryRouter.post('/:queueId/join',
    handleNewQueueEntry
);

queueEntryRouter.post('/:queueId/call_next',
    restrictValidUserOnly,
    handleCallNext
);

queueEntryRouter.post('/:queueId/completed',
    restrictValidUserOnly,
    handleCompleted
);

queueEntryRouter.post('/:queueId/skipped',
    restrictValidUserOnly,
    handleSkipped
);

queueEntryRouter.get('/:queueId/stats',
    restrictValidUserOnly,
    handleShowStats
);

queueEntryRouter.get('/:queueId/analytics',
    restrictValidUserOnly,
    handleAnalytics
);

queueEntryRouter.get('/:queueId/position/:tokenNumber',
    handleGetCustomerPosition
);

export default queueEntryRouter;