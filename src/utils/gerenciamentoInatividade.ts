export class gerenciamentoInatividade {
  private callback: () => void;
  private timeout: number;
  private timer: ReturnType<typeof setTimeout> | null;
  private warningCallback: ((remainingTime: number) => void) | null;

  constructor(callback: () => void, timeout: number = 600000) {
    this.callback = callback;
    this.timeout = timeout;
    this.timer = null;
    this.warningCallback = null;
    this.resetTimer = this.resetTimer.bind(this);
  }

  onWarning(callback: (remainingTime: number) => void): void {
    this.warningCallback = callback;
  }

  start(): void {
    window.addEventListener("mousemove", this.resetTimer);
    window.addEventListener("keydown", this.resetTimer);
    window.addEventListener("click", this.resetTimer);

    this.resetTimer();
    this.callback();
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    window.removeEventListener("mousemove", this.resetTimer);
    window.removeEventListener("keydown", this.resetTimer);
    window.removeEventListener("click", this.resetTimer);
  }

  private resetTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.callback();
    }, this.timeout);

    // dispara aviso quando passar de 5 minutos restantes
    if (this.warningCallback) {
      setTimeout(() => {
        this.warningCallback!(300); // 300s = 5 min
      }, this.timeout - 300000);
    }
  }
}
