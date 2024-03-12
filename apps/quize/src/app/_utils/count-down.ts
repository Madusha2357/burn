import { CountdownTimer } from '@damen/models';

export function getCountdownTimer(
  endDateInEpochMs: number,
  offset: number
): CountdownTimer {
  const milliSecondsInASecond = 1000;
  const hoursInADay = 24;
  const minutesInAnHour = 60;
  const secondsInAMinute = 60;

  const timeDifference = endDateInEpochMs - Date.now() + offset * 60 * 1000;

  let daysToDday = Math.floor(
    timeDifference /
      (milliSecondsInASecond * minutesInAnHour * secondsInAMinute * hoursInADay)
  );

  let hoursToDday = Math.floor(
    (timeDifference /
      (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) %
      hoursInADay
  );

  let minutesToDday = Math.floor(
    (timeDifference / (milliSecondsInASecond * minutesInAnHour)) %
      secondsInAMinute
  );

  let secondsToDday =
    Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute;

  if (timeDifference < 0) {
    daysToDday = 0;
    hoursToDday = 0;
    minutesToDday = 0;
    secondsToDday = 0;
  }

  return { secondsToDday, minutesToDday, hoursToDday, daysToDday };
}

export function countDownTimerInSeconds(endDateInEpochMs: number) {
  const timeDifference = endDateInEpochMs - Date.now();
  const milliSecondsInASecond = 1000;
  const secondsToDday = Math.floor(timeDifference / milliSecondsInASecond);

  return { secondsToDday, hoursToDday: 0, minutesToDday: 0, daysToDday: 0 };
}
