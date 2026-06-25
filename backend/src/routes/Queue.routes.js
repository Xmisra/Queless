import express from "express";
import restrictValidUserOnly from "../middlewares/auth.middleware.js";
import { handleCreateQueue,handleGetMyQueues,handleGetQueueById,handleUpdateQueue,handleDeleteQueue } from "../controllers/Queue.controller.js";

const queueRouter = express.Router();

queueRouter.post('/create',restrictValidUserOnly,handleCreateQueue);
queueRouter.get('/',restrictValidUserOnly,handleGetMyQueues);
queueRouter.get('/:queueId',restrictValidUserOnly,handleGetQueueById);
queueRouter.put('/:queueId',restrictValidUserOnly,handleUpdateQueue);
queueRouter.delete('/:queueId',restrictValidUserOnly,handleDeleteQueue);

export default queueRouter;