import { SchoolPage } from './app.po';

describe('school App', () => {
  let page: SchoolPage;

  beforeEach(() => {
    page = new SchoolPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
