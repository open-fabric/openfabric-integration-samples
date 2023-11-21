import express from 'express';
import {create, consentCapturePage, approvePatLink, createPatPage, createPatSuccessPage} from '../controllers/pat.js'

const router = express.Router();

router.route('/api/pat').post(create);
router.route('/api/pat/:id/approve').patch(approvePatLink);
router.route('/pat/consent/:id').get(consentCapturePage);
router.route('/pat/create').get(createPatPage);
router.route('/pat/create_success').get(createPatSuccessPage)

export default router;
