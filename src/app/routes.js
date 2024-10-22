export class Routes {
    pages = new Map();
    
    constructor(classPagesList) {
        for (let instanceClassPage of classPagesList) {
            const getPageContentFunction = async () => { return instanceClassPage.getPageContent(); }
            for (let path of instanceClassPage.paths) {
                this.pages.set(path, getPageContentFunction);
            }
        }
    }

    async getPageContent(path) {
        const getPageContent = this.pages.get(path) || this.pages.get('not-found');
        return await getPageContent()
    }

    async updatePageContent(path) {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = await this.getPageContent(path);
    }
}