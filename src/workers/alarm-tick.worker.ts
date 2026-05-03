/// <reference lib="webworker" />

type StartMsg = { type: "start"; alarmAt: number };
type StopMsg = { type: "stop" };

let timer: ReturnType<typeof setInterval> | undefined;

function clearTimer() {
  if (timer !== undefined) {
    clearInterval(timer);
    timer = undefined;
  }
}

self.onmessage = (event: MessageEvent<StartMsg | StopMsg>) => {
  const data = event.data;
  if (data.type === "stop") {
    clearTimer();
    return;
  }
  if (data.type !== "start") return;

  clearTimer();
  const { alarmAt } = data;

  const tick = () => {
    const now = Date.now();
    const due = now >= alarmAt;
    (self as DedicatedWorkerGlobalScope).postMessage({
      type: "tick",
      now,
      due,
    });
    if (due) clearTimer();
  };

  tick();
  timer = setInterval(tick, 1000);
};
