import Queue from "../models/Queue.model.js";

async function handleCreateQueue(req, res) {

    try {
        const { name, location, avgServiceTime } = req.body;

        if (!name || !location || !avgServiceTime) {
            return res.status(400).json({
                error: "bad request!!!"
            })
        };
        const admin = req.user.id;
        const queue = await Queue.create({
            name,
            location,
            admin,
            avgServiceTime
        });

        return res.status(201).json({
            message: "Your Queue has been created!!",
            queue
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

async function handleGetMyQueues(req, res) {
    try {
        const queues = await Queue.find({
            admin: req.user.id
        }).
            sort({
                createdAt: -1
            }).lean();

        return res.status(200).json({
            queues
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
async function handleGetQueueById(req, res) {
    try {
        const { queueId } = req.params;

        const queue = await Queue.findById(queueId).lean();

        if (!queue) {
            return res.status(404).json({
                error: "queue not found!!!"
            })
        };

        if (queue.admin.toString() !== req.user.id) {
            return res.status(403).json({
                error: "forbidden!!!"
            })
        }

        return res.status(200).json({
            queue
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    };
}

async function handleUpdateQueue(req, res) {
    try {
        const { queueId } = req.params;
        const { name, location, avgServiceTime } = req.body;

        const queue = await Queue.findById(queueId);

        if (!queue) {
            return res.status(404).json({
                error: "queue not found!!!"
            });
        }

        if (queue.admin.toString() !== req.user.id) {
            return res.status(403).json({
                error: "forbidden!!!"
            });
        }

        if (name) queue.name = name;
        if (location) queue.location = location;
        if (avgServiceTime) queue.avgServiceTime = avgServiceTime;

        await queue.save();

        return res.status(200).json({
            queue
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
async function handleDeleteQueue(req, res) {
    try {
        const { queueId } = req.params;

        const queue = await Queue.findById(queueId);

        if (!queue) {
            return res.status(404).json({
                error: "queue not found!!!"
            });
        }

        if (queue.admin.toString() !== req.user.id) {
            return res.status(403).json({
                error: "forbidden!!!"
            });
        }

        await queue.deleteOne();

        return res.status(200).json({
            message: "queue has been deleted successfully!!!"
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }

}
async function handleOpenQueue(req, res) {

    try {
        const { queueId } = req.params;
        const queue = await Queue.findById(queueId);
        if (!queue) {
            return res.status(404).json({
                error: "No queue found!!!"
            });
        }

        if(queue.admin.toString() !== req.user.id)
        {
            return res.status(403).json({
                error: "Forbidden!!!"
            });
        }
        if (queue.isActive) {
            return res.status(409).json({
                error: "The queue is already active!!!"
            });
        }

        queue.isActive = true;
        await queue.save();

        return res.status(200).json({
            message: "The queue has been opened successfully!!!"
        });
    }
    catch(err)
    {
        return res.status(500).json({
            error: err.message
        });
    }
}
async function handleCloseQueue(req, res) {

    try {
        const { queueId } = req.params;
        const queue = await Queue.findById(queueId);
        if (!queue) {
            return res.status(404).json({
                error: "No queue found!!!"
            });
        }

        if(queue.admin.toString() !== req.user.id)
        {
            return res.status(403).json({
                error: "Forbidden!!!"
            });
        }
        if (!queue.isActive) {
            return res.status(409).json({
                error: "The queue is already closed!!!"
            });
        }

        queue.isActive = false;
        await queue.save();

        return res.status(200).json({
            message: "The queue has been closed successfully!!!"
        });
    }
    catch(err)
    {
        return res.status(500).json({
            error: err.message
        });
    }
}
export { handleCreateQueue, handleGetMyQueues, handleGetQueueById, handleUpdateQueue, handleDeleteQueue,handleOpenQueue,handleCloseQueue };