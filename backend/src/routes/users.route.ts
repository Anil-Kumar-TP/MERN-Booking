import express, { Request, Response, Router } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

const router: Router = express.Router();

router.post('/register', [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password","Password with 6 or more characters required").isLength({min:6}),
],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: errors.array() });
            return;
        }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        user = new User(req.body);
        await user.save();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '1d'
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000
        });
        res.sendStatus(200);
    } catch (error: unknown) {
        console.error('Error in register user controller:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;