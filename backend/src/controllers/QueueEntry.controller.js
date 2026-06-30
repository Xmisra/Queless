import QueueEntry from "../models/QueueEntry.model.js";
import Queue from "../models/Queue.model.js";
import { getIO } from "../socket/socket.js";

async function handleNewQueueEntry(req, res) {
    try {
        const { queueId } = req.params;
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                error: "Name and Phone number is required!!!"
            });
        }
        const queue = await Queue.findById(queueId);
        if (!queue) {
            return res.status(404).json({
                error: "queue not found!!!"
            });
        }

        if (!queue.isActive) {
            return res.status(400).json({
                error: "The queue is not active anymore!!!"
            });
        }

        // const token = queue.lastTokenNumber;

        // const newEntry = await QueueEntry.create({
        //     queueId,
        //     name,
        //     phone,
        //     tokenNumber: token + 1,
        //     status: "Waiting"
        // });

        // queue.lastTokenNumber = token + 1;
        // await queue.save();

        // const queue = await Queue.findByIdAndUpdate(
        //     queueId,
        //     {
        //         $inc: {
        //             lastTokenNumber: 1
        //         }
        //     },
        //     {
        //         new: true
        //     }
        // );

        // const tokenNumber = queue.lastTokenNumber;

        // const io = getIO();

        // io.to(queueId).emit("customer-joined", {
        //     queueId,
        //     tokenNumber: token + 1,
        //     customerName: name
        // });

        // return res.status(201).json({
        //     message: `You Have been succesfully added to the queue!!!
        //     Your Token Number Is : ${token + 1}`,
        //     tokenNumber: token + 1

        // });

        const updatedQueue = await Queue.findByIdAndUpdate(
            queueId,
            {
                $inc: {
                    lastTokenNumber: 1
                }
            },
            {
                new: true
            }
        );

        const tokenNumber = updatedQueue.lastTokenNumber;

        const newEntry = await QueueEntry.create({
            queueId,
            name,
            phone,
            tokenNumber,
            status: "Waiting"
        });

        const io = getIO();

        io.to(queueId).emit("customer-joined", {
            queueId,
            tokenNumber,
            customerName: name
        });

        return res.status(201).json({
            message: "You have been successfully added to the queue!",
            tokenNumber
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
async function handleCallNext(req, res) {
    try {
        console.log("CALL NEXT HIT");
        const { queueId } = req.params;
        const queue = await Queue.findById(queueId);

        if (!queue) {
            return res.status(404).json({
                error: "queue not found!!!"
            });
        }
        if (!queue.isActive) {
            return res.status(400).json({
                error: "This Queue is Inactive!!!"
            });
        }
        if (queue.admin.toString() !== req.user.id) {
            return res.status(403).json({
                error: "Forbidden!!!"
            });
        }

        const calledCustomer = await QueueEntry.findOne({
            queueId,
            status: "Called"
        });

        if (calledCustomer) {
            return res.status(409).json({
                error: "The previous customer hasn't been completed yet!! You can't call the next customer"
            });
        }

        const newCalled = await QueueEntry.findOne({
            queueId,
            status: "Waiting"
        }).
            sort({ createdAt: 1 });

        if (!newCalled) {
            return res.status(409).json({
                error: "No customer is waiting!!!"
            });
        }

        newCalled.status = "Called";
        newCalled.calledAt = Date.now();

        await newCalled.save();

        const io = getIO();

        const room = io.sockets.adapter.rooms.get(queueId);


        io.to(queueId).emit("customer-called", {
            queueId,
            tokenNumber: newCalled.tokenNumber,
            customerName: newCalled.name
        });

        return res.status(200).json({
            newCalled
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
async function handleCompleted(req, res) {
    try {
        const { queueId } = req.params;
        const queue = await Queue.findById(queueId);

        if (!queue) {
            return res.status(404).json({
                error: "queue not found!!!"
            });
        }
        if (!queue.isActive) {
            return res.status(400).json({
                error: "This Queue is Inactive!!!"
            });
        }
        if (queue.admin.toString() !== req.user.id) {
            return res.status(403).json({
                error: "Forbidden!!!"
            });
        }

        const calledCustomer = await QueueEntry.findOne({
            queueId,
            status: "Called"
        });

        if (!calledCustomer) {
            return res.status(409).json({
                error: "No customer has been called yet!!"
            });
        }

        calledCustomer.status = "Completed";
        calledCustomer.completedAt = Date.now();

        await calledCustomer.save();

        const io = getIO();

        io.to(queueId).emit("customer-completed", {
            queueId,
            tokenNumber: calledCustomer.tokenNumber,
            customerName: calledCustomer.name
        });

        return res.status(200).json({
            calledCustomer
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
async function handleSkipped(req, res) {
    try {
        const { queueId } = req.params;
        const queue = await Queue.findById(queueId);

        if (!queue) {
            return res.status(404).json({
                error: "queue not found!!!"
            });
        }
        if (!queue.isActive) {
            return res.status(400).json({
                error: "This Queue is Inactive!!!"
            });
        }
        if (queue.admin.toString() !== req.user.id) {
            return res.status(403).json({
                error: "Forbidden!!!"
            });
        }

        const calledCustomer = await QueueEntry.findOne({
            queueId,
            status: "Called"
        });

        if (!calledCustomer) {
            return res.status(409).json({
                error: "No customer has been called yet!!"
            });
        }

        calledCustomer.status = "Skipped";

        await calledCustomer.save();

        const io = getIO();

        io.to(queueId).emit("customer-skipped", {
            queueId,
            tokenNumber: calledCustomer.tokenNumber,
            customerName: calledCustomer.name
        });

        return res.status(200).json({
            calledCustomer
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
async function handleShowStats(req, res) {
    try {
        const { queueId } = req.params;
        const queue = await Queue.findById(queueId);

        if (!queue) {
            return res.status(404).json({
                error: "queue not found!!!"
            });
        }
        if (!queue.isActive) {
            return res.status(400).json({
                error: "This Queue is Inactive!!!"
            });
        }
        if (queue.admin.toString() !== req.user.id) {
            return res.status(403).json({
                error: "Forbidden!!!"
            });
        }

        const calledCustomer = await QueueEntry.findOne({
            queueId,
            status: "Called"
        });

        const currentCustomer = {
            name: calledCustomer?.name,
            phone: calledCustomer?.phone,
            tokenNumber: calledCustomer?.tokenNumber
        }

        const countWaiting = await QueueEntry.countDocuments({
            queueId,
            status: "Waiting"
        });

        const totalWaiting = countWaiting;


        const nextWaiting = await QueueEntry.findOne({
            queueId,
            status: "Waiting"
        }).
            sort({ createdAt: 1 });


        const nextCustomer = {
            name: nextWaiting?.name,
            phone: nextWaiting?.phone,
            tokenNumber: nextWaiting?.tokenNumber
        }
        const countCompleted = await QueueEntry.countDocuments({
            queueId,
            status: "Completed"
        });

        const totalCompleted = countCompleted;

        const countSkipped = await QueueEntry.countDocuments({
            queueId,
            status: "Skipped"
        });

        const totalSkipped = countSkipped;

        return res.status(200).json({
            currentCustomer,
            totalWaiting,
            nextCustomer,
            totalCompleted,
            totalSkipped
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
async function handleGetCustomerPosition(req, res) {
    try {
        const { queueId, tokenNumber } = req.params;

        const queue = await Queue.findById(queueId);

        if (!queue) {
            return res.status(404).json({
                error: "Queue not found!!!"
            });
        }

        const customer = await QueueEntry.findOne({
            queueId,
            tokenNumber
        });

        if (!customer) {
            return res.status(404).json({
                error: "Customer not found!!!"
            });
        }

        if (customer.status === "Completed") {
            return res.status(200).json({
                status: "Completed"
            });
        }

        if (customer.status === "Skipped") {
            return res.status(200).json({
                status: "Skipped"
            });
        }

        if (customer.status === "Called") {
            return res.status(200).json({
                status: "Called",
                position: 0,
                estimatedWaitTime: 0
            });
        }

        const position = await QueueEntry.countDocuments({
            queueId,
            status: "Waiting",
            tokenNumber: {
                $lte: customer.tokenNumber
            }
        });

        const estimatedWaitTime =
            (position - 1) * queue.avgServiceTime;

        return res.status(200).json({
            status: "Waiting",
            tokenNumber: customer.tokenNumber,
            position,
            estimatedWaitTime
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
async function handleAnalytics(req, res) {
    try {
        const { queueId } = req.params;

        const queue = await Queue.findById(queueId);

        if (!queue) {
            return res.status(404).json({
                error: "Queue not found."
            });
        }

        if (!queue.isActive) {
            return res.status(400).json({
                error: "This queue is inactive."
            });
        }

        if (queue.admin.toString() !== req.user.id) {
            return res.status(403).json({
                error: "Forbidden."
            });
        }

        const [
            total,
            totalWaiting,
            totalCalled,
            totalCompleted,
            totalSkipped
        ] = await Promise.all([
            QueueEntry.countDocuments({ queueId }),
            QueueEntry.countDocuments({ queueId, status: "Waiting" }),
            QueueEntry.countDocuments({ queueId, status: "Called" }),
            QueueEntry.countDocuments({ queueId, status: "Completed" }),
            QueueEntry.countDocuments({ queueId, status: "Skipped" })
        ]);

        return res.status(200).json({
            total,
            totalWaiting,
            totalCalled,
            totalCompleted,
            totalSkipped
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
export { handleNewQueueEntry, handleCallNext, handleCompleted, handleSkipped, handleShowStats, handleGetCustomerPosition, handleAnalytics };