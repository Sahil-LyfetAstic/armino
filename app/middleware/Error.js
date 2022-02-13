//create a Error middleware

export const errorMiddleware = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            error: messages,
        });
    }
    next(err);

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
        });
    }
}