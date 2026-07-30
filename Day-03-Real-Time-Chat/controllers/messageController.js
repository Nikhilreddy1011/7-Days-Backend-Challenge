const Message = require("../models/Message");

const getRoomMessages = async (req, res) => {

    try {

        const messages = await Message.find({

            room: req.params.room

        }).sort({

            createdAt: 1

        });

        res.status(200).json({

            success: true,

            count: messages.length,

            messages

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getRoomMessages

};