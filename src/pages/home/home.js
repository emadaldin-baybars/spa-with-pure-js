export class Home {
  paths = ['home', 'index.html'];

  constructor() { }

  async getPageContent() {    
    return `<div>
                <h1>Welcome to the Home Page</h1>
                <p>This SPA supports history navigation.</p>
            </div>`
  }
}
  