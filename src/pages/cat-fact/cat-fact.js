export class CatFact {
  paths = ['cat-fact'];
  catFact;
  constructorPromise;

  constructor() {
    this.constructorPromise = fetch('https://catfact.ninja/fact').then(async (response) => {
      this.catFact = (await response.json()).fact;
    });
  }

  async getPageContent() {
    await this.constructorPromise;
    return `<h1>Cat Fact</h1>
            <p>${this.catFact}</p>
            <p><i>The Cat Fact is reset only after the page reloads.</i></p>`;
  }
}