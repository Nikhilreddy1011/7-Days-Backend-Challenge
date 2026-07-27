const { nanoid } = require("nanoid");
const Url = require("../models/Url");

const createShortUrl = async (req, res, next) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                message: "Original URL is required"
            });
        }

        try {
            new URL(originalUrl);
        } catch {
            return res.status(400).json({
                message: "Please provide a valid URL"
            });
        }

        const existingUrl = await Url.findOne({ originalUrl });

        if (existingUrl) {
            return res.status(200).json({
                originalUrl: existingUrl.originalUrl,
                shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`
            });
        }

        const shortCode = nanoid(7);

        const url = await Url.create({
            originalUrl,
            shortCode
        });

        res.status(201).json({
            originalUrl: url.originalUrl,
            shortUrl: `${process.env.BASE_URL}/${url.shortCode}`
        });

    } catch (error) {
        next(error);
    }
};

const redirectUrl = async (req, res, next) => {
    try {
        const url = await Url.findOne({
            shortCode: req.params.shortCode
        });

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }

        url.clicks += 1;

        await url.save();

        res.redirect(url.originalUrl);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createShortUrl,
    redirectUrl
};