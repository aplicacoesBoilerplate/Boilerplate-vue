export class gerenciamentoInatividade {
  private callback: () => void;
  private timeout: number;
  private timer: ReturnType<typeof setTimeout> | null;
  private warningCallback: ((remainingTime: number) => void) | null;
  private warningTimer: ReturnType<typeof setTimeout> | null;
  private resetCallback: (() => void) | null = null;

  constructor(callback: () => void, timeout: number = 600000) {
    this.callback = callback;
    this.timeout = timeout;
    this.timer = null;
    this.warningCallback = null;
    this.warningTimer = null;
    this.resetTimer = this.resetTimer.bind(this);
    this.resetCallback = null;
  }

  onWarning(callback: (remainingTime: number) => void): void {
    this.warningCallback = callback;
  }

  onReset(callback: () => void): void {
    this.resetCallback = callback;
  }

  start(): void {
    window.addEventListener("mousemove", this.resetTimer);
    window.addEventListener("keydown", this.resetTimer);
    window.addEventListener("click", this.resetTimer);

    this.resetTimer();
  }

  stop(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.warningTimer) clearTimeout(this.warningTimer);
    window.removeEventListener("mousemove", this.resetTimer);
    window.removeEventListener("keydown", this.resetTimer);
    window.removeEventListener("click", this.resetTimer);
  }

  private resetTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.warningTimer) clearTimeout(this.warningTimer);

    this.timer = setTimeout(() => {
      this.callback();
    }, this.timeout);

    if (this.warningCallback) {
      this.warningTimer = setTimeout(() => {
        this.warningCallback!(300); // 5 minutos
      }, this.timeout - 300000);
    }

    if (this.resetCallback) {
      this.resetCallback();
    }
  }
}
