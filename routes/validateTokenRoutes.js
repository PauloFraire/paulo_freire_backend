import express from "express";
import {
    createValidateToken,
    verifyValidateToken,
    deleteValidateToken,
    deleteTokensByEmail
} from "../controllers/validateTokenController.js";

const router = express.Router();

router.post("/token-create", createValidateToken);
router.post("/token-verify", verifyValidateToken);
router.delete("/token-delete", deleteValidateToken);
router.delete("/tokens-delete-email", deleteTokensByEmail);

export default router;
