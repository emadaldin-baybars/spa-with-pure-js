export class NotFound {
  paths = ['not-found'];

  constructor() { }

  async getPageContent() {
    return "<h1>Page Not Found</h1>";
  }
}
  