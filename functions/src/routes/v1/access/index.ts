import express from 'express';
import loginRoutes from './login';
import logoutRoutes from './logout';
import tokenRoutes from './token'


const router = express.Router();


router.use("/login",loginRoutes);
router.use("/logout",logoutRoutes);
router.use("/token",tokenRoutes);


export default router;