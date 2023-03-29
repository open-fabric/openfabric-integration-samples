import express from 'express';
import {create, consentCapturePage, approvePatLink} from '../controllers/pat'

const router = express.Router();

router.route('/merchant-pat-link/api/pat').post(create);
router.route('/merchant-pat-link/pat/consent/:id').get(consentCapturePage);
router.route('/merchant-pat-link/api/pat/:id/approve').patch(approvePatLink);

export default router;
