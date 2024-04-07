class Handler {
    setNext(handler) {
      this.next = handler;
      return handler;
    }
  
    async handle(request) {
      if (this.next) {
        return await this.next.handle(request);
      }
      return true; // End of chain
    }
  }
  
  module.exports = Handler;
  