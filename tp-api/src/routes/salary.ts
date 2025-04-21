import express from 'express';
import { Request, Response } from 'express';
import { loadIscoData, findGroupCodeFor } from '../utils/iscoLoader';
import { mapOccupationToActivity } from '../utils/occupationToActivityMapper';
import { fetchSalaryDataByGroupCode } from '../services/activitiesService';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { occupationCode, activityCode } = req.body;

  let groupCode: string | null = null;

  if (occupationCode) {
    await loadIscoData();
    const iscoGroup = findGroupCodeFor(occupationCode);
    if (!iscoGroup) {
      res.status(400).json({ error: 'Sobivat ISCO ametirühma ei leitud' });
      return;
    }
    groupCode = mapOccupationToActivity(iscoGroup) ?? null;
  }

  if (!groupCode && activityCode) {
    groupCode = activityCode;
  }

  if (!groupCode) {
    res.status(400).json({ error: 'Puudub kehtiv groupCode' });
    return;
  }

  const salaryData = await fetchSalaryDataByGroupCode(groupCode);
  res.json({ groupCode, salaryData });
}));

export default router;
