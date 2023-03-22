import express from 'express';
import {create, consentCapturePage, approvePatLink} from '../controllers/pat'

const router = express.Router();

router.route('/api/pat').post(create);
router.route('/pat/consent/:id').get(consentCapturePage);
router.route('/api/pat/:id/approve').patch(approvePatLink);

export default router;
