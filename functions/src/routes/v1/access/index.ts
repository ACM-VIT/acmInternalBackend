import express from 'express';
import loginRoutes from './login';
import logoutRoutes from './logout';


const router = express.Router();


router.use("/login",loginRoutes);
router.use("/logout",logoutRoutes);


export default router;