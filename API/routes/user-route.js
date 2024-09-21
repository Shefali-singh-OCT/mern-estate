import express from 'express';
import { deleteUser, SignOut, test, updateUser } from '../controller/userController.js';
import { verifyToken } from '../utils/verifyuser.js';

const router = express.Router();
router.get("/test",test);
router.post("/update/:id",verifyToken,updateUser)
router.delete("/delete/:id",verifyToken,deleteUser)
router.get("/signout",verifyToken,SignOut)

export default router