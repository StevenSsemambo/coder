// Small facts about the learner that are not progress: did they see the welcome, which course did they choose,
// did they dismiss a reminder, when did they last back up. Stored in one record so a backup can carry it.
import { kvGet, kvSet } from './storage.js';

export const getProfile = async () => ({ welcomed: false, startCourse: null, interest: null, backupAt: 0, installDismissed: false, backupSnoozed: 0, ...(await kvGet('profile', {})) });

export async function updateProfile(patch) {
  const next = { ...(await getProfile()), ...patch };
  await kvSet('profile', next);
  return next;
}
