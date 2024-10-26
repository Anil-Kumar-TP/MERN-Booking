import express, { Request, Response, Router } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import verifyToken from '../middleware/auth';

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
        res.status(200).send({ message: 'User registered successfully' });
    } catch (error: unknown) {
        console.error('Error in register user controller:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get('/me', verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error:unknown) {
        console.log('error in me route', error instanceof Error ? error.message : 'Error');
        res.status(500).json({ message: 'Something went wrong' });
    }
})

export default router;