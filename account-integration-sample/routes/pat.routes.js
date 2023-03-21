import express from 'express';
import { create, consentCapturePage } from '../controllers/pat'

const router = express.Router();

router.route('/api/pat').post(create);
router.route('/pat/consent/:id').get(consentCapturePage);

export default router;
