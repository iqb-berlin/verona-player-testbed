export class VeronaPostService {
  sessionID: string | undefined;
  postTarget: Window = window.parent;

  private sendMessage(message: string): void {
    this.postTarget.postMessage(message, '*');
  }
}
